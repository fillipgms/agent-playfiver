import { Tour } from "nextstepjs";
import { useEffect, useState } from "react";
import { useNextStep } from "nextstepjs";

export const steps: Tour[] = [
    {
        tour: "mainTour",
        steps: [
            {
                icon: "👋",
                title: "Bem-vindo!",
                content: (
                    <>
                        <p>Seja bem-vindo ao novo painel da PlayFiver!</p>
                        <p>Vou te guiar pelas principais mudanças.</p>
                    </>
                ),
                selector: "#home-component",
                showControls: true,
                showSkip: true,
                pointerPadding: 10,
                pointerRadius: 10,
            },
            {
                icon: "",
                title: "Menu lateral",
                content: (
                    <>
                        <p>
                            As páginas foram organizadas aqui. Vamos navegar
                            juntos.
                        </p>
                    </>
                ),
                selector: "#sidebar",
                side: "right",
                showControls: true,
                showSkip: false,
                pointerPadding: 10,
                pointerRadius: 10,
            },
            {
                icon: "",
                title: "Dashboard",
                content: (
                    <>
                        <p>
                            Visão geral com métricas principais do seu painel.
                        </p>
                    </>
                ),
                selector: "#link-",
                side: "right",
                showControls: true,
                showSkip: false,
                pointerPadding: 10,
                pointerRadius: 10,
                nextRoute: "/jogadores",
            },
            {
                icon: "",
                title: "Jogadores",
                content: (
                    <>
                        <p>Gerencie e acompanhe seus jogadores.</p>
                    </>
                ),
                selector: "#link-jogadores",
                side: "right",
                showControls: true,
                showSkip: false,
                pointerPadding: 10,
                pointerRadius: 10,
                nextRoute: "/transacoes",
                prevRoute: "/",
            },
            {
                icon: "",
                title: "Transações",
                content: (
                    <>
                        <p>Visualize e filtre as transações.</p>
                    </>
                ),
                selector: "#link-transacoes",
                side: "right",
                showControls: true,
                showSkip: false,
                pointerPadding: 10,
                pointerRadius: 10,
                nextRoute: "/ipwhitelist",
                prevRoute: "/jogadores",
            },
            {
                icon: "",
                title: "IP Whitelist",
                content: (
                    <>
                        <p>Gerencie os IPs autorizados para acesso.</p>
                    </>
                ),
                selector: "#link-ipwhitelist",
                side: "right",
                showControls: true,
                showSkip: false,
                pointerPadding: 10,
                pointerRadius: 10,
                nextRoute: "/custom",
                prevRoute: "/transacoes",
            },
            {
                icon: "",
                title: "Customização Esporte",
                content: (
                    <>
                        <p>
                            Personalize cores e aparência do site de esportes.
                        </p>
                    </>
                ),
                selector: "#link-custom",
                side: "right",
                showControls: true,
                showSkip: false,
                pointerPadding: 10,
                pointerRadius: 10,
                nextRoute: "/custom",
                prevRoute: "/ipwhitelist",
            },
            {
                icon: "",
                title: "Temas Pré-Definidos",
                content: (
                    <>
                        <p>
                            Cansado de ter que escolher mil opções de cores?
                            Aqui você pode escolher entre os temas
                            pré-definidos.
                        </p>
                    </>
                ),
                selector: "#pre-defined",
                side: "right",
                showControls: true,
                showSkip: false,
                pointerPadding: 10,
                pointerRadius: 10,
            },

            {
                icon: "",
                title: "Customização Esporte",
                content: (
                    <>
                        <p>
                            Se ainda não gostou dos temas pré-definidos, aqui
                            você pode criar o seu próprio tema.
                        </p>
                    </>
                ),
                selector: "#customize",
                side: "right",
                showControls: true,
                showSkip: false,
                pointerPadding: 10,
                pointerRadius: 10,
            },

            {
                icon: "",
                title: "Finalizando",
                content: (
                    <>
                        <p>
                            O painel foi modernizado para oferecer mais clareza
                            e rapidez no dia a dia.
                        </p>
                        <p>Conte com nosso suporte sempre que precisar.</p>
                    </>
                ),
                selector: "#home-component",
                showControls: true,
                showSkip: false,
                pointerPadding: 10,
                pointerRadius: 10,
            },
        ],
    },
];

export const useFirstVisitTour = () => {
    const { startNextStep } = useNextStep();

    useEffect(() => {
        const hasVisited = localStorage.getItem("playfiver-first-visit");

        if (!hasVisited) {
            localStorage.setItem("playfiver-first-visit", "true");

            const timer = setTimeout(() => {
                startNextStep("mainTour");
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [startNextStep]);
};

export const useSidebarMobileTourStep = () => {
    const { currentStep } = useNextStep();
    const [isSidebarMobileStep, setIsSidebarMobileStep] = useState(false);

    useEffect(() => {
        if (currentStep !== null && currentStep !== undefined) {
            const sidebarMobileStepIndex = [1, 2, 3, 4, 5, 6];
            const isSidebarStep = sidebarMobileStepIndex.includes(currentStep);
            setIsSidebarMobileStep(isSidebarStep);

            if (isSidebarStep) {
                const stepToElementId: Record<number, string> = {
                    1: "sidebar",
                    2: "link-",
                    3: "link-jogadores",
                    4: "link-transacoes",
                    5: "link-ipwhitelist",
                    6: "link-custom",
                };

                const targetId = stepToElementId[currentStep];

                if (targetId) {
                    const timer = setTimeout(() => {
                        const el = document.getElementById(targetId);
                        el?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }, 350);

                    return () => clearTimeout(timer);
                }
            }
        }
    }, [currentStep]);

    return isSidebarMobileStep;
};
