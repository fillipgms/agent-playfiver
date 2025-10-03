"use client";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";

import logo from "@/public/logo.png";
import Link from "next/link";

import {
    UsersThreeIcon,
    ArrowsLeftRightIcon,
    FileTextIcon,
    // PaletteIcon,
    UserCircleIcon,
} from "@phosphor-icons/react";
import GridIcon from "@/public/GridIcon";

const links = [
    {
        section: "Geral",
        items: [
            {
                icon: <GridIcon width={24} height={24} />,
                name: "Dashboard",
                url: "/",
            },
            {
                icon: <UsersThreeIcon size={24} />,
                name: "Jogadores",
                url: "/jogadores",
            },
            {
                icon: <ArrowsLeftRightIcon size={24} />,
                name: "Transações",
                url: "/transacoes",
            },
        ],
    },
    {
        section: "Configurações",
        items: [
            // {
            //     icon: <PaletteIcon size={24} />,
            //     name: "Customização Esporte",
            //     url: "/custom",
            // },
            {
                icon: <UserCircleIcon size={24} />,
                name: "Perfil",
                url: "/profile",
            },
        ],
    },
    {
        section: "Suporte",
        items: [
            {
                icon: <FileTextIcon size={24} />,
                name: "documentação",
                url: "https://api.playfivers.com/docs/api",
            },
        ],
    },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const pathname = usePathname();

    return (
        <>
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}

            <div
                className={`
                fixed md:sticky md:translate-x-0 transition-transform duration-300 ease-in-out z-40
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                h-svh py-4 pl-4 left-0 top-0 w-64 md:w-auto
            `}
            >
                <aside
                    id="sidebar"
                    className="bg-background-primary h-full px-2 py-4 rounded-md shadow-lg md:shadow-none"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2">
                            <Image
                                src={logo.src}
                                height={logo.height}
                                width={logo.width}
                                alt="logo"
                                className="size-9"
                            />
                            <span className="font-black text-2xl text-primary">
                                Playfiver
                            </span>
                        </div>

                        <div className="overflow-y-auto">
                            {links.map((linkGroup) => (
                                <div
                                    key={linkGroup.section}
                                    className="space-y-2 text-sm"
                                >
                                    <p className="text-foreground/50 font-light">
                                        {linkGroup.section}
                                    </p>
                                    <ul className="space-y-2">
                                        {linkGroup.items.map((item) => {
                                            const isActive =
                                                pathname === item.url;
                                            return (
                                                <li
                                                    className="py-1 px-6 text-foreground/50 relative"
                                                    key={item.name}
                                                    id={`link-${item.url.replace(
                                                        "/",
                                                        ""
                                                    )}`}
                                                >
                                                    {isActive && (
                                                        <div className="absolute h-full w-1 left-0 top-0 bg-primary"></div>
                                                    )}
                                                    <Link
                                                        href={item.url}
                                                        className="flex items-center gap-2"
                                                        onClick={onClose}
                                                    >
                                                        {item.name ===
                                                        "Dashboard" ? (
                                                            <GridIcon
                                                                width={24}
                                                                height={24}
                                                                fill={isActive}
                                                                color={
                                                                    isActive
                                                                        ? "#009DD5"
                                                                        : undefined
                                                                }
                                                            />
                                                        ) : (
                                                            React.cloneElement(
                                                                item.icon,
                                                                isActive
                                                                    ? {
                                                                          weight: "fill",
                                                                          color: "#009DD5",
                                                                      }
                                                                    : {}
                                                            )
                                                        )}
                                                        <span
                                                            className={`${
                                                                isActive
                                                                    ? "font-semibold text-foreground"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {item.name}
                                                        </span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
};

export default Sidebar;
