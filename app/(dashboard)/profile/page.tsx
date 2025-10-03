"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useSession } from "@/contexts/SessionContext";
import {
    DownloadIcon,
    CopyIcon,
    UserIcon,
    GlobeIcon,
    CurrencyDollarIcon,
    PercentIcon,
    LockIcon,
    GameControllerIcon,
    ShieldIcon,
    CheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
    Select,
    SelectValue,
    SelectItem,
    SelectContent,
    SelectTrigger,
} from "@/components/ui/select";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";

const currencyOptions = [
    { label: "Real Brasileiro (BRL)", value: "BRL" },
    { label: "Dolar(USD)", value: "USD" },
    { label: "Euro (EUR)", value: "EUR" },
    { label: "Guarani (PYG)", value: "PYG" },
    { label: "Iene japonês (JPY)", value: "JPY" },
    { label: "Rublo russo (RUR)", value: "RUR" },
    { label: "Taka bengali (BDT)", value: "BDT" },
    { label: "Yuan (RMB)", value: "RMB" },
    { label: "Baht (THB)", value: "THB" },
    { label: "Rupia (INR)", value: "INR" },
    { label: "Peso Filipino (PHP)", value: "PHP" },
    { label: "Birr etíope (ETB)", value: "ETB" },
];

export default function ProfilePage() {
    const { user } = useSession();
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        password: "",
        rtp: "95.5",
        bonus_enable: false,
        limit_enable: false,
        url: "",
        currency: "BRL",
        limit_amount: "0",
        limit_hours: "24",
    });

    useEffect(() => {
        if (user?.agente) {
            setForm({
                password: user.agente.password || "",
                rtp: user.agente.rtp || "95.5",
                bonus_enable: Boolean(user.agente.bonus_enable),
                limit_enable: Boolean(user.agente.limit_enable),
                url: user.agente.url || "",
                currency: user.agente.currency || "BRL",
                limit_amount: user.agente.limite_amount || "0",
                limit_hours: user.agente.limit_hours || "24",
            });
        }
    }, [user?.agente]);

    if (!user || !user.agente) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <UserIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                        Carregando perfil...
                    </h2>
                </div>
            </div>
        );
    }

    const agent = user.agente;

    const copyToClipboard = async (text: string, fieldName: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type } = e.target;
        const value =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : e.target.value;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRtpTextChange = (value: string) => {
        let sanitized = value.replace(/[^0-9.]/g, "");
        const parts = sanitized.split(".");
        if (parts.length > 2) {
            sanitized = parts.shift()! + "." + parts.join("");
        }
        const numeric = Number(sanitized);
        if (Number.isFinite(numeric)) {
            const clamped = Math.max(1, Math.min(100, numeric));
            setForm((prev) => ({ ...prev, rtp: String(clamped) }));
        } else {
            setForm((prev) => ({ ...prev, rtp: "" }));
        }
    };

    const rtpNumber = Number(form.rtp) || 0;

    const handleSave = async () => {
        const payload = {
            password: form.password,
            rtp: form.rtp,
            bonus_enable: form.bonus_enable ? 1 : 0,
            limit_enable: form.limit_enable ? 1 : 0,
            url: form.url,
            currency: form.currency,
            limite_amount: form.limit_amount,
            limit_hours: form.limit_hours,
        };

        try {
            const res = await updateProfile({
                profile: payload,
            });
            if (res.status === 1) {
                toast.success("Perfil atualizado com sucesso");
                setIsEditing(false);
            } else {
                toast.error(res.message || "Erro ao atualizar perfil");
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : (error as { message?: string })?.message ||
                      "Erro ao atualizar perfil";
            toast.error(message);
        }
        setIsEditing(false);
    };

    const handleDownload = () => {
        try {
            const data = {
                agent_name: agent.agent_memo,
                code: agent.agent_code,
                token: agent.agent_token,
                secret: agent.agent_secret,
                password: form.password,
                rtp: form.rtp,
                bonus_enable: form.bonus_enable,
                callback_url: form.url,
                limit_enable: form.limit_enable,
                limit_amount: form.limit_amount,
                limit_hours: form.limit_hours,
                currency: form.currency,
                exported_at: new Date().toISOString(),
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const safeCode = (agent.agent_code || "agente").replace(
                /[^a-z0-9_-]/gi,
                "_"
            );
            link.download = `agent-profile-${safeCode}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 0);
        } catch (error) {
            console.error("Erro ao gerar download:", error);
        }
    };

    const handleCancel = () => {
        setForm({
            password: agent.password || "",
            rtp: agent.rtp || "95.5",
            bonus_enable: Boolean(agent.bonus_enable),
            limit_enable: Boolean(agent.limit_enable),
            url: agent.url || "",
            currency: agent.currency || "BRL",
            limit_amount: agent.limite_amount || "0",
            limit_hours: agent.limit_hours || "24",
        });
        setIsEditing(false);
    };

    return (
        <main className="space-y-6 p-6">
            <section className="bg-background-secondary rounded-xl p-6 border border-foreground/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {agent.agent_memo}
                            </h1>
                            <p className="text-sm text-foreground/60">
                                {user.name} • {agent.currency}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={handleDownload}>
                            <DownloadIcon className="w-4 h-4" />
                            Baixar Informações
                        </Button>
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)}>
                                Editar Perfil
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleSave}>
                                    Salvar Alterações
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-background-secondary rounded-xl p-6 border border-foreground/10">
                    <div className="flex items-center gap-2 pb-4 border-b border-foreground/10 mb-6">
                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                        <h2 className="text-lg font-semibold text-foreground">
                            Informações Básicas
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Token
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={agent.agent_token}
                                    readOnly
                                    className="w-full h-10 px-3 pr-10 border border-foreground/20 rounded-lg bg-background-secondary/50 text-foreground/80 cursor-not-allowed"
                                />
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            agent.agent_token,
                                            "token"
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-foreground/10 rounded transition-colors"
                                >
                                    {copiedField === "token" ? (
                                        <CheckIcon className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <CopyIcon className="w-4 h-4 text-foreground/60" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Segredo
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={agent.agent_secret}
                                    readOnly
                                    className="w-full h-10 px-3 pr-10 border border-foreground/20 rounded-lg bg-background-secondary/50 text-foreground/80 cursor-not-allowed"
                                />
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            agent.agent_secret,
                                            "secret"
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-foreground/10 rounded transition-colors"
                                >
                                    {copiedField === "secret" ? (
                                        <CheckIcon className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <CopyIcon className="w-4 h-4 text-foreground/60" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Código
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={agent.agent_code}
                                    readOnly
                                    className="w-full h-10 px-3 pr-10 border border-foreground/20 rounded-lg bg-background-secondary/50 text-foreground/80 cursor-not-allowed"
                                />
                                <button
                                    onClick={() =>
                                        copyToClipboard(
                                            agent.agent_code,
                                            "code"
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-foreground/10 rounded transition-colors"
                                >
                                    {copiedField === "code" ? (
                                        <CheckIcon className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <CopyIcon className="w-4 h-4 text-foreground/60" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full h-10 px-3 pl-10 border border-foreground/20 rounded-lg bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Digite uma senha segura"
                                />
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-background-secondary rounded-xl p-6 border border-foreground/10">
                    <div className="flex items-center gap-2 pb-4 border-b border-foreground/10 mb-6">
                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                        <h2 className="text-lg font-semibold text-foreground">
                            Configurações do Jogo
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                RTP (Return to Player) %
                            </label>
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="rtp"
                                        value={form.rtp}
                                        onChange={(e) =>
                                            handleRtpTextChange(e.target.value)
                                        }
                                        disabled={!isEditing}
                                        className="w-full h-10 px-3 pr-8 border border-foreground/20 rounded-lg bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="95.5"
                                    />
                                    <PercentIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                </div>

                                {isEditing && (
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min={1}
                                            max={100}
                                            step={0.01}
                                            value={rtpNumber}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    rtp: String(e.target.value),
                                                }))
                                            }
                                            className="w-full h-2 bg-foreground/20 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                        <div className="flex justify-between text-xs text-foreground/60">
                                            <span>1%</span>
                                            <span className="font-medium text-primary">
                                                {rtpNumber
                                                    ? rtpNumber.toFixed(2)
                                                    : "0.00"}
                                                %
                                            </span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Moeda
                            </label>
                            <Select
                                value={form.currency}
                                onValueChange={(value) => {
                                    setForm((prev) => ({
                                        ...prev,
                                        currency: value,
                                    }));
                                }}
                                disabled={!isEditing}
                            >
                                <SelectTrigger className="w-full h-10 border-foreground/20 focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                    <div className="flex items-center gap-2">
                                        <CurrencyDollarIcon className="w-4 h-4 text-foreground/40" />
                                        <SelectValue placeholder="Selecione uma moeda" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    {currencyOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bônus */}
                        <div className="flex items-center justify-between p-4 bg-background-secondary/50 rounded-lg border border-foreground/10">
                            <div className="flex items-center gap-3">
                                <GameControllerIcon className="w-5 h-5 text-primary" />
                                <div>
                                    <span className="text-sm font-medium text-foreground">
                                        Jogos com Bônus
                                    </span>
                                    <p className="text-xs text-foreground/60">
                                        Habilitar jogos que oferecem bônus
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="bonus_enable"
                                    checked={form.bonus_enable}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-foreground/20 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-foreground/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        {/* URL de Callback */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                URL de Callback
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    name="url"
                                    value={form.url}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full h-10 px-3 pl-10 border border-foreground/20 rounded-lg bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="https://exemplo.com/callback"
                                />
                                <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Limites de Aposta */}
            <section className="bg-background-secondary rounded-xl p-6 border border-foreground/10">
                <div className="flex items-center gap-2 pb-4 border-b border-foreground/10 mb-6">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Limites de Aposta
                    </h2>
                </div>

                <div className="space-y-6">
                    {/* Limite de Aposta Toggle */}
                    <div className="flex items-center justify-between p-4 bg-background-secondary/50 rounded-lg border border-foreground/10">
                        <div className="flex items-center gap-3">
                            <ShieldIcon className="w-5 h-5 text-primary" />
                            <div>
                                <span className="text-sm font-medium text-foreground">
                                    Limite de Aposta
                                </span>
                                <p className="text-xs text-foreground/60">
                                    Definir limites para apostas do agente
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="limit_enable"
                                checked={form.limit_enable}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-foreground/20 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-foreground/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {/* Campos de Limite */}
                    {form.limit_enable && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-background-secondary/30 rounded-lg border border-foreground/10">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Quantia do Limite
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="limit_amount"
                                        value={form.limit_amount}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full h-10 px-3 pl-10 border border-foreground/20 rounded-lg bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="0.00"
                                    />
                                    <CurrencyDollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Horas do Limite
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        name="limit_hours"
                                        value={form.limit_hours}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full h-10 px-3 pl-10 border border-foreground/20 rounded-lg bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="24"
                                    />
                                    <ShieldIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
