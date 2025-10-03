type User = {
    balance: string;
    name: string;
    agente: UserAgent;
    currency: string;
};

type UserAgent = {
    id: number;
    agent_memo: string;
    agent_code: string;
    agent_token: string;
    agent_secret: string;
    password: string;
    rtp: string;
    rtp_user: string;
    influencers: number;
    currency: string;
    url: string;
    bonus_enable: number;
    limit_enable: number;
    limite_amount: string;
    limit_hours: string;
    created_date: string;
};

type ProfilePayload = {
    bonus_enable: number;
    currency: string;
    limit_enable: number;
    limit_hours: string;
    limite_amount: string;
    password: string;
    rtp: string;
    url: string;
};

interface SessionPayload {
    accessToken: string;
    tokenType: string;
    expires: string;
}

interface HomeArray {
    game_name: string;
    count: number;
}

interface HomeResponse {
    user_count: number;
    agent_count: number;
    active_players: number;
    games_views: HomeArray[];
    provedores_views: HomeArray[];
}

interface Agent {
    id: number;
    agent_memo: string;
    agent_code: string;
    agent_token: string;
    agent_secret: string;
    password: string;
    rtp: string;
    rtp_user: string;
    influencers: number;
    currency: string;
    url: string;
    bonus_enable: number;
    limit_enable: number;
    limite_amount: string;
    limit_hours: string;
    created_date: string;
}

interface AgentsResponse {
    current_page: number;
    data: Agent[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface GameProps {
    id: number;
    name: string;
    game_code: string;
    image_url: string;
    status: number;
    provedor: string;
    rodadasfree: number;
    original: number;
    blocked: boolean;
    provedorId: number;
    created_at: string;
}

interface WalletResponseProps {
    current_page: number;
    data: WalletProps[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface WalletProps {
    id: number;
    name: string;
    saldo: string;
    agents: WalletAgentProps[];
    status: number;
    provedores: { name: string; id: number }[];
}

interface WalletAgentProps {
    name: string;
    bet: string;
    win: string;
    total: string;
}

interface GgrTableProps {
    above: string;
    created_at: string;
    id: number;
    revendedor: number;
    tax: number;
    type: number;
    updated_at: string;
    wallet: string;
}

interface GamesResponse {
    current_page: number;
    data: GameProps[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    provedor: Array<{
        id: number;
        name: string;
    }>;
}

interface GamesFilters {
    page?: number;
    search?: string;
    provedor?: string[];
    typeGame?: string[];
    bonus?: string;
    carteira?: string[];
}

interface OrderResponseProps {
    current_page: number;
    data: OrderProps[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface OrderProps {
    id: number;
    amount: string;
    amount_add: string;
    getaway: string;
    type: string;
    expired: string | null;
    quantity: string;
    wallet: string;
    payment_id: string;
    status: number;
    created_at: string;
}

interface AgentSignature {
    id: number;
    agent_memo: string;
}

interface SignatureResponse {
    agentes: AgentSignature[];
    prices: {
        inf: string;
    };
}

interface InfluencerOrderResponse {
    id?: string | number;
    qrcode?: string;
    qrcode64?: string;
    url?: string;
}

interface TourStep {
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
    selector: string;
    side: "top" | "bottom" | "left" | "right";
    showControls?: boolean;
    pointerPadding?: number;
    pointerRadius?: number;
    nextRoute?: string;
    prevRoute?: string;
}

interface Tour {
    tour: string;
    steps: TourStep[];
}

interface Customization {
    swiper_theme_color: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    background_color: string;
    text_primary_color: string;
    background_opacity: string;
    background_opacity_hover: string;
    header_color: string;
    deposit_color: string;
    gradient_color: string;
    gradient_color_to: string;
    tw_shadow: string;
    text_top_color: string;
    background_profile: string;
    text_btn_primary: string;
    color_button1: string;
    color_button2: string;
    color_button3: string;
    color_button4: string;
}

interface CustomizationResponse {
    status: number;
    data: Customization;
}
