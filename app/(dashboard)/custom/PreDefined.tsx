"use client";
import { Card, CardContent } from "@/components/Card";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { themes } from "@/data/themes";
import React, { Dispatch, SetStateAction } from "react";
import Button from "@/components/Button";
import { toast } from "sonner";
import { updateCustomData } from "@/actions/custom";

const PreDefined = ({
    customData,
    setSelectedColors,
}: {
    customData: CustomizationResponse;
    setSelectedColors: Dispatch<SetStateAction<CustomizationResponse>>;
}) => {
    const [selected, setSelected] = React.useState(themes[0]);
    const [isApplying, setIsApplying] = React.useState(false);

    React.useEffect(() => {
        if (!customData) return;

        const matchesTheme = (colors: Customization) => {
            return Object.keys(colors).every((key) => {
                const k = key as keyof Customization;
                return colors[k] === customData.data[k];
            });
        };

        const found = themes.find((t) => matchesTheme(t.colors));
        if (found) {
            setSelected(found);
        }
    }, [customData]);

    const applyThemeChange = async () => {
        if (isApplying || !selected) return;
        setIsApplying(true);
        try {
            const res = await updateCustomData({
                theme: selected.name,
                customization: selected.colors,
            });

            if (res.status === 1) {
                toast.success("Tema aplicado com sucesso");
                setSelectedColors({
                    status: res.status,
                    data: selected.colors,
                });
            } else {
                toast.error(res.message || "Erro ao aplicar tema");
            }
        } catch {
            toast.error("Erro inesperado ao aplicar tema");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <Card>
            <CardContent className="flex flex-col gap-4">
                <div className="flex gap-4 flex-wrap">
                    {themes.map((theme) => (
                        <div
                            key={theme.name}
                            className="flex flex-col items-center gap-2"
                        >
                            <Tooltip>
                                <TooltipTrigger
                                    type="button"
                                    aria-label={theme.name}
                                    title={theme.name}
                                    onClick={() => {
                                        setSelected(theme);

                                        setSelectedColors({
                                            status: customData.status,
                                            data: theme.colors,
                                        });
                                    }}
                                    className={`h-14 w-14 cursor-pointer rounded-full ring-2 ${
                                        selected.name === theme.name
                                            ? "ring-primary"
                                            : "ring-border"
                                    }`}
                                    style={{
                                        background: `linear-gradient(135deg, 
                                          ${theme.colors.primary_color}, 
                                          ${theme.colors.secondary_color}
                                        )`,
                                        boxShadow: `0 0 0 1px rgba(0,0,0,.08) inset, ${theme.colors.tw_shadow}`,
                                    }}
                                ></TooltipTrigger>
                                <TooltipContent>
                                    <p>{theme.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={applyThemeChange}
                    type="submit"
                    disabled={isApplying}
                    aria-busy={isApplying}
                >
                    {isApplying ? "Aplicando..." : "Aplicar tema"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default PreDefined;
