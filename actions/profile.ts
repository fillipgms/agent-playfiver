"use server";
import axios from "axios";
import { getSession } from "./user";
import { redirect } from "next/navigation";
import { getFriendlyHttpErrorMessage } from "@/lib/httpError";

export async function updateProfile(payload: { profile: ProfilePayload }) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    try {
        const { data } = await axios.put(
            `${process.env.API_ROUTES_BASE}/profile`,
            payload.profile,
            {
                timeout: 5000,
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        );

        if (!data) {
            throw new Error("No valid data received from API");
        }

        return data;
    } catch (error) {
        console.error("Failed to update profile data:", error);
        const err = error as unknown;
        const apiMessage = (err as { response?: { data?: { msg?: string } } })
            ?.response?.data?.msg;

        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
        ) {
            redirect("/login");
        }

        throw new Error(
            apiMessage ||
                getFriendlyHttpErrorMessage(err, "Falha ao atualizar perfil")
        );
    }
}
