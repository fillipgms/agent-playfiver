import PlayersTable from "@/components/tables/PlayersTable";
import { Metadata } from "next";
import { getPlayersData } from "@/actions/players";
import { Suspense } from "react";
import PaginationControls from "@/components/PaginationControls";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Jogadores",
    description: "Jogadores do sistema",
};

interface JogadoresPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
    }>;
}

export default async function JogadoresPage({
    searchParams,
}: JogadoresPageProps) {
    try {
        const resolvedSearchParams = await searchParams;
        const page = parseInt(resolvedSearchParams.page || "1");
        const search = resolvedSearchParams.search || "";

        const res = await getPlayersData(page, search);
        const jogadores = res.data;

        return (
            <main className="space-y-8">
                <section>
                    <Suspense fallback={<div>Carregando tabela...</div>}>
                        <PlayersTable players={jogadores} />
                    </Suspense>
                </section>

                <Suspense fallback={<div>Carregando paginação...</div>}>
                    <PaginationControls
                        currentPage={res.current_page}
                        lastPage={res.last_page}
                        hasNextPage={!!res.next_page_url}
                        hasPrevPage={!!res.prev_page_url}
                        baseUrl="/jogadores"
                        searchParams={resolvedSearchParams}
                    />
                </Suspense>
            </main>
        );
    } catch (error) {
        if (
            error instanceof Error &&
            error.message.includes("Sessão expirada")
        ) {
            redirect("/login");
        }

        throw error;
    }
}
