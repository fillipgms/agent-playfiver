import { Metadata } from "next";
import { getCustomData } from "@/actions/custom";
import CustomizatoinClient from "./CustomizatoinClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Customização Esporte",
    description: "customização do esporte",
};

export default async function customSportPage() {
    const currentColors = await getCustomData();

    if (currentColors.status !== 1) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <h1 className="text-xl font-semibold mb-2">
                        Você não tem permissão para acessar esta página
                    </h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        Por favor, contate o suporte para mais informações.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Link href="/">
                            <Button>Voltar para início</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="space-y-4">
            <section>
                <h1 className="text-2xl font-bold">Customização Esportes</h1>
            </section>
            <CustomizatoinClient currentColors={currentColors} />
        </main>
    );
}
