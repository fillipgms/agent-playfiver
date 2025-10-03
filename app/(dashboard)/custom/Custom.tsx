"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/Card";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { MagicWandIcon, SunDimIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { MoonStarsIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { updateCustomData } from "@/actions/custom";

type theme = "dark" | "light";

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const cleaned = hex.replace(/^#/, "");
    const full =
        cleaned.length === 3
            ? cleaned
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : cleaned.padStart(6, "0").slice(0, 6);
    const r = parseInt(full.slice(0, 2), 16) || 0;
    const g = parseInt(full.slice(2, 4), 16) || 0;
    const b = parseInt(full.slice(4, 6), 16) || 0;
    return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (v: number) =>
        clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const rgbToHsl = (
    r: number,
    g: number,
    b: number
): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h = 0,
        s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (
    h: number,
    s: number,
    l: number
): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;
    if (s === 0) {
        const v = Math.round(l * 255);
        return { r: v, g: v, b: v };
    }
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1 / 3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1 / 3);
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
};

const adjustLightness = (hexColor: string, amount: number) => {
    const { r, g, b } = hexToRgb(hexColor);
    const hsl = rgbToHsl(r, g, b);
    const l = clamp(hsl.l + amount, 0, 100);
    const { r: nr, g: ng, b: nb } = hslToRgb(hsl.h, hsl.s, l);
    return rgbToHex(nr, ng, nb);
};

const rotateHue = (hexColor: string, degrees: number) => {
    const { r, g, b } = hexToRgb(hexColor);
    const hsl = rgbToHsl(r, g, b);
    const h = (hsl.h + degrees + 360) % 360;
    const { r: nr, g: ng, b: nb } = hslToRgb(h, hsl.s, hsl.l);
    return rgbToHex(nr, ng, nb);
};

const generateComplementary = (baseColor: string) => {
    return rotateHue(baseColor, 180);
};

const generateAnalogous = (baseColor: string) => {
    return [rotateHue(baseColor, -30), baseColor, rotateHue(baseColor, 30)];
};

const generateTriadic = (baseColor: string) => {
    return [baseColor, rotateHue(baseColor, 120), rotateHue(baseColor, 240)];
};

const generateSplitComplementary = (baseColor: string) => {
    return [baseColor, rotateHue(baseColor, 150), rotateHue(baseColor, 210)];
};

const generateTetradic = (baseColor: string) => {
    return [
        baseColor,
        rotateHue(baseColor, 90),
        rotateHue(baseColor, 180),
        rotateHue(baseColor, 270),
    ];
};

const generateMonochromatic = (baseColor: string) => {
    const { r, g, b } = hexToRgb(baseColor);
    const { h, s } = rgbToHsl(r, g, b);

    const veryDark = hslToRgb(h, s, 20);
    const dark = hslToRgb(h, s, 40);
    const light = hslToRgb(h, s, 70);
    const veryLight = hslToRgb(h, s, 85);

    return [
        rgbToHex(veryDark.r, veryDark.g, veryDark.b),
        rgbToHex(dark.r, dark.g, dark.b),
        baseColor,
        rgbToHex(light.r, light.g, light.b),
        rgbToHex(veryLight.r, veryLight.g, veryLight.b),
    ];
};

type PaletteType =
    | "monochromatic"
    | "analogous"
    | "complementary"
    | "splitComplementary"
    | "triadic"
    | "tetradic"
    | "random";

const generateAdvancedPalette = (
    baseColor: string,
    paletteType: PaletteType
) => {
    let colors: string[] = [];

    switch (paletteType) {
        case "monochromatic":
            colors = generateMonochromatic(baseColor);
            return {
                primary: colors[2],
                secondary: colors[1],
                accent: colors[3],
            };

        case "analogous":
            colors = generateAnalogous(baseColor);
            return {
                primary: colors[1],
                secondary: colors[0],
                accent: colors[2],
            };

        case "complementary":
            const complement = generateComplementary(baseColor);
            return {
                primary: baseColor,
                secondary: adjustLightness(baseColor, -20),
                accent: complement,
            };

        case "splitComplementary":
            colors = generateSplitComplementary(baseColor);
            return {
                primary: colors[0],
                secondary: colors[1],
                accent: colors[2],
            };

        case "triadic":
            colors = generateTriadic(baseColor);
            return {
                primary: colors[0],
                secondary: colors[1],
                accent: colors[2],
            };

        case "tetradic":
            colors = generateTetradic(baseColor);
            return {
                primary: colors[0],
                secondary: colors[2],
                accent: colors[1],
            };

        case "random":
        default:
            const randomHue = Math.random() * 360;
            const randomSaturation = 40 + Math.random() * 40;
            const randomLightness = 45 + Math.random() * 20;

            const randomRgb = hslToRgb(
                randomHue,
                randomSaturation,
                randomLightness
            );
            const randomBase = rgbToHex(randomRgb.r, randomRgb.g, randomRgb.b);
            const paletteTypes: PaletteType[] = [
                "complementary",
                "analogous",
                "triadic",
                "splitComplementary",
            ];
            const randomPaletteType =
                paletteTypes[Math.floor(Math.random() * paletteTypes.length)];

            return generateAdvancedPalette(randomBase, randomPaletteType);
    }
};

const getColorHarmoniousText = (
    hexBg: string,
    primaryColor: string,
    mode: theme = "dark"
) => {
    const { r, g, b } = hexToRgb(hexBg);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    const needsLightText = yiq < 128;

    if (mode === "light") {
        if (needsLightText) {
            return mix("#FFFFFF", primaryColor, 0.05);
        } else {
            const rgb = hexToRgb(primaryColor);
            const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
            const {
                r: dr,
                g: dg,
                b: db,
            } = hslToRgb(h, Math.max(s * 0.8, 20), 15);
            return rgbToHex(dr, dg, db);
        }
    } else {
        if (needsLightText) {
            return mix("#F7FAFC", primaryColor, 0.1);
        } else {
            const rgb = hexToRgb(primaryColor);
            const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
            const {
                r: dr,
                g: dg,
                b: db,
            } = hslToRgb(h, Math.max(s * 0.9, 25), 12);
            return rgbToHex(dr, dg, db);
        }
    }
};

const getContrastText = (hexBg: string, mode: theme = "dark") => {
    const { r, g, b } = hexToRgb(hexBg);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    if (mode === "light") {
        return yiq >= 128 ? "#2D3748" : "#F7FAFC";
    } else {
        return yiq >= 128 ? "#1A202C" : "#F7FAFC";
    }
};

const toRgba = (hexColor: string, alpha: number) => {
    const { r, g, b } = hexToRgb(hexColor);
    return `rgba(${r},${g},${b},${alpha})`;
};

const mix = (hexA: string, hexB: string, weight: number) => {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const w = clamp(weight, 0, 1);
    const r = Math.round(a.r * (1 - w) + b.r * w);
    const g = Math.round(a.g * (1 - w) + b.g * w);
    const b2 = Math.round(a.b * (1 - w) + b.b * w);
    return rgbToHex(r, g, b2);
};

const ColorDisplay = ({
    name,
    color,
    mode = "dark",
    primaryColor,
    onColorChange,
}: {
    name: string;
    color: string;
    mode?: theme;
    primaryColor?: string;
    onColorChange?: (newColor: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempColor, setTempColor] = useState(color);
    const [tempInputValue, setTempInputValue] = useState(color.toUpperCase());

    const textColor = primaryColor
        ? getColorHarmoniousText(color, primaryColor, mode)
        : getContrastText(color, mode);

    const isValidHex = (value: string) =>
        /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);

    const handleTempPickerChange = (value: string) => {
        setTempColor(value);
        setTempInputValue(value.toUpperCase());
        if (onColorChange) {
            onColorChange(value);
        }
    };

    const handleTempInputChange: React.ChangeEventHandler<HTMLInputElement> = (
        e
    ) => {
        let value = e.target.value.toUpperCase();
        value = value.replace(/[^#0-9A-F]/g, "");
        value = value.replace(/#+/g, "#");
        if (!value.startsWith("#")) value = `#${value.replace(/#/g, "")}`;
        if (value.length > 7) value = value.slice(0, 7);

        setTempInputValue(value);
        if (isValidHex(value)) {
            setTempColor(value);
            if (onColorChange) {
                onColorChange(value);
            }
        }
    };

    const preventHashRemoval: React.KeyboardEventHandler<HTMLInputElement> = (
        e
    ) => {
        const target = e.currentTarget;
        const start = target.selectionStart ?? 0;
        const end = target.selectionEnd ?? 0;
        const isDeleteKey = e.key === "Backspace" || e.key === "Delete";
        if (!isDeleteKey) return;

        const value = target.value ?? "";

        if (start === 0 && end > 0) {
            e.preventDefault();
            const next = "#";
            setTempInputValue(next);
            requestAnimationFrame(() => {
                try {
                    target.setSelectionRange(1, 1);
                } catch {}
            });
            return;
        }

        const deletingHashDirectly =
            (e.key === "Backspace" && start === 1 && end === 1) ||
            (e.key === "Delete" && start === 0);
        if (deletingHashDirectly) {
            e.preventDefault();
            requestAnimationFrame(() => {
                try {
                    target.setSelectionRange(1, 1);
                } catch {}
            });
            return;
        }

        if (value === "#") {
            e.preventDefault();
            requestAnimationFrame(() => {
                try {
                    target.setSelectionRange(1, 1);
                } catch {}
            });
        }
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        setTempColor(color);
        setTempInputValue(color.toUpperCase());
    }, [color]);

    const colorPickerContent = (
        <div className="flex flex-col gap-3 p-4">
            <div className="text-sm font-medium text-center">Editar {name}</div>
            <HexColorPicker
                className="w-48 h-48 rounded-md"
                color={tempColor}
                onChange={handleTempPickerChange}
            />
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-md bg-background-secondary p-2">
                    <div
                        style={{ background: tempColor }}
                        className="size-6 rounded"
                        aria-hidden="true"
                    ></div>
                    <Input
                        value={tempInputValue}
                        onChange={handleTempInputChange}
                        onKeyDown={preventHashRemoval}
                        placeholder="#000000"
                        aria-invalid={!isValidHex(tempInputValue)}
                        className="font-mono text-xs h-8"
                    />
                </div>
                {!isValidHex(tempInputValue) && (
                    <span className="text-xs text-destructive">
                        HEX válido (#RGB ou #RRGGBB)
                    </span>
                )}
            </div>
        </div>
    );

    const triggerElement = (
        <button
            type="button"
            aria-label={`Editar ${name}`}
            className="py-3 px-5 rounded flex items-center justify-center shadow cursor-pointer hover:scale-105 transition-transform"
            style={{ background: color, color: textColor }}
        >
            {name}
        </button>
    );

    if (isMobile) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>{triggerElement}</DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Cor - {name}</DialogTitle>
                    </DialogHeader>
                    {colorPickerContent}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{triggerElement}</PopoverTrigger>
            <PopoverContent side="top" className="w-auto p-0" sideOffset={8}>
                {colorPickerContent}
            </PopoverContent>
        </Popover>
    );
};

const detectThemeFromColors = (colors: Customization): theme => {
    const bgRgb = hexToRgb(colors.background_color);
    const bgHsl = rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b);

    return bgHsl.l > 50 ? "light" : "dark";
};

const getWebsiteTheme = (): theme => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") return "light";
    if (savedTheme === "dark") return "dark";

    return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
};

const Custom = ({
    customData,
    setSelectedColors,
}: {
    customData: CustomizationResponse;
    setSelectedColors: React.Dispatch<
        React.SetStateAction<CustomizationResponse>
    >;
}) => {
    const [theme, setTheme] = useState<theme>("dark");
    const [color, setColor] = useState("#000000");
    const [inputValue, setInputValue] = useState("#000000");
    const [allColors, setAllColors] = useState<Customization>();
    const [currentPaletteType, setCurrentPaletteType] =
        useState<PaletteType>("monochromatic");
    const [isApplying, setIsApplying] = useState(false);

    const isInitializingRef = React.useRef(true);

    useEffect(() => {
        isInitializingRef.current = true;

        if (customData?.data) {
            const detectedTheme = detectThemeFromColors(customData.data);
            setTheme(detectedTheme);
            setAllColors(customData.data);

            if (customData.data?.primary_color) {
                setColor(customData.data.primary_color);
                setInputValue(customData.data.primary_color.toUpperCase());
            }
        } else {
            const websiteTheme = getWebsiteTheme();
            setTheme(websiteTheme);
        }

        setTimeout(() => {
            isInitializingRef.current = false;
        }, 0);
    }, [customData]);

    const isValidHex = (value: string) =>
        /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);

    const handlePickerChange = (value: string) => {
        setColor(value);
        setInputValue(value.toUpperCase());
        setCurrentPaletteType("monochromatic");
    };

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
        e
    ) => {
        let value = e.target.value.toUpperCase();
        value = value.replace(/[^#0-9A-F]/g, "");

        value = value.replace(/#+/g, "#");

        if (!value.startsWith("#")) value = `#${value.replace(/#/g, "")}`;

        if (value.length > 7) value = value.slice(0, 7);

        setInputValue(value);
        if (isValidHex(value)) {
            setColor(value);
            setCurrentPaletteType("monochromatic");
        }
    };

    const preventHashRemoval: React.KeyboardEventHandler<HTMLInputElement> = (
        e
    ) => {
        const target = e.currentTarget;
        const start = target.selectionStart ?? 0;
        const end = target.selectionEnd ?? 0;
        const isDeleteKey = e.key === "Backspace" || e.key === "Delete";
        if (!isDeleteKey) return;

        const value = target.value ?? "";

        if (start === 0 && end > 0) {
            e.preventDefault();

            const next = "#";
            setInputValue(next);
            requestAnimationFrame(() => {
                try {
                    target.setSelectionRange(1, 1);
                } catch {}
            });
            return;
        }

        const deletingHashDirectly =
            (e.key === "Backspace" && start === 1 && end === 1) ||
            (e.key === "Delete" && start === 0);
        if (deletingHashDirectly) {
            e.preventDefault();
            requestAnimationFrame(() => {
                try {
                    target.setSelectionRange(1, 1);
                } catch {}
            });
            return;
        }

        if (value === "#") {
            e.preventDefault();
            requestAnimationFrame(() => {
                try {
                    target.setSelectionRange(1, 1);
                } catch {}
            });
        }
    };

    const randomize = () => {
        const randomTheme = Math.floor(Math.random() * 2) + 1;

        if (randomTheme === 1) {
            setTheme("light");
        } else {
            setTheme("dark");
        }

        const paletteTypes: PaletteType[] = [
            "complementary",
            "analogous",
            "triadic",
            "splitComplementary",
            "tetradic",
            "monochromatic",
        ];
        const randomPaletteType =
            paletteTypes[Math.floor(Math.random() * paletteTypes.length)];
        setCurrentPaletteType(randomPaletteType);

        const randomHue = Math.random() * 360;
        const randomSaturation = 50 + Math.random() * 40;
        const randomLightness = 40 + Math.random() * 30;

        const { r, g, b } = hslToRgb(
            randomHue,
            randomSaturation,
            randomLightness
        );
        const rand = rgbToHex(r, g, b);

        setColor(rand);
        setInputValue(rand.toUpperCase());
    };

    const generatePalette = useCallback(
        (
            base: string,
            mode: theme,
            paletteType: PaletteType = "monochromatic"
        ): Customization => {
            const advancedColors = generateAdvancedPalette(base, paletteType);
            const primary = advancedColors.primary;
            const secondary = advancedColors.secondary;
            const accent = advancedColors.accent;

            const baseRgb = hexToRgb(base);
            const { h, s } = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
            const bgLight = hslToRgb(h, Math.min(s * 0.15, 8), 97);
            const bgLightHex = rgbToHex(bgLight.r, bgLight.g, bgLight.b);
            const bgDark = mix("#0B0B0F", adjustLightness(base, -40), 0.25);
            const background = mode === "light" ? bgLightHex : bgDark;
            const header =
                mode === "light"
                    ? adjustLightness(background, -12)
                    : adjustLightness(background, -6);
            const textPrimary = getColorHarmoniousText(
                background,
                primary,
                mode
            );

            const gradientFrom = toRgba(primary, 0.25);
            const gradientTo = toRgba(secondary, 0.18);
            const bgOpacity = toRgba(primary, 0.14);
            const bgOpacityHover = toRgba(primary, 0.22);
            const shadow = toRgba(primary, 0.28);

            const topText =
                mode === "light"
                    ? adjustLightness(primary, 40)
                    : adjustLightness(primary, 20);
            const profileBg =
                mode === "light"
                    ? adjustLightness(background, 6)
                    : adjustLightness(background, -6);
            const btnTextPrimary = getColorHarmoniousText(
                primary,
                primary,
                mode
            );

            const btn1 =
                mode === "light"
                    ? adjustLightness(primary, -5)
                    : adjustLightness(primary, 0);
            const btn2 =
                mode === "light"
                    ? adjustLightness(primary, -12)
                    : adjustLightness(primary, -8);
            const btn3 =
                mode === "light"
                    ? adjustLightness(primary, -20)
                    : adjustLightness(primary, -16);
            const btn4 =
                mode === "light"
                    ? adjustLightness(primary, 8)
                    : adjustLightness(primary, 10);

            return {
                swiper_theme_color: accent,
                primary_color: primary,
                secondary_color: secondary,
                accent_color: accent,
                background_color: background,
                text_primary_color: textPrimary,
                background_opacity: bgOpacity,
                background_opacity_hover: bgOpacityHover,
                header_color: header,
                deposit_color: mode === "light" ? "#00000088" : "#FFFFFF66",
                gradient_color: gradientFrom,
                gradient_color_to: gradientTo,
                tw_shadow: shadow,
                text_top_color: topText,
                background_profile: profileBg,
                text_btn_primary: btnTextPrimary,
                color_button1: btn1,
                color_button2: btn2,
                color_button3: btn3,
                color_button4: btn4,
            };
        },
        []
    );

    useEffect(() => {
        if (isInitializingRef.current || !isValidHex(color)) return;

        const palette = generatePalette(color, theme, currentPaletteType);
        setAllColors(palette);

        setSelectedColors({
            status: customData?.status || 1,
            data: palette,
        });
    }, [
        color,
        theme,
        currentPaletteType,
        generatePalette,
        customData?.status,
        setSelectedColors,
    ]);

    const applyThemeChange = async () => {
        if (isApplying || !allColors) return;
        setIsApplying(true);
        try {
            const res = await updateCustomData({
                theme: "Custom",
                customization: allColors,
            });

            if (res.status === 1) {
                toast.success("Tema aplicado com sucesso");
                setSelectedColors({
                    status: res.status,
                    data: allColors,
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
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <div className="text-muted-foreground flex items-center justify-center rounded-lg p-1 w-full bg-background-secondary gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => setTheme("dark")}
                                    variant={
                                        theme === "dark" ? "outline" : "ghost"
                                    }
                                    className="flex-1 cursor-pointer"
                                >
                                    <MoonStarsIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Modo Escuro</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => setTheme("light")}
                                    variant={
                                        theme === "light" ? "outline" : "ghost"
                                    }
                                    className="flex-1 cursor-pointer"
                                >
                                    <SunDimIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Modo Claro</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <HexColorPicker
                        className="w-full rounded-md"
                        color={color}
                        onChange={handlePickerChange}
                    />

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2 rounded-md bg-background-secondary p-2">
                            <div
                                style={{ background: color }}
                                className="size-8 rounded"
                                aria-hidden="true"
                            ></div>
                            <Input
                                id="hexSelector"
                                name="hexSelector"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={preventHashRemoval}
                                placeholder="#000000"
                                aria-invalid={!isValidHex(inputValue)}
                                className="font-mono flex-1 min-w-40"
                            />
                        </div>
                        {!isValidHex(inputValue) && (
                            <span className="text-xs text-destructive">
                                Use um HEX válido (#RGB ou #RRGGBB)
                            </span>
                        )}
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={randomize}
                            title="Aleatória"
                            className="cursor-pointer w-full"
                        >
                            <MagicWandIcon />
                            Surpreenda-me
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={applyThemeChange}
                            type="submit"
                            className="w-full cursor-pointer"
                            disabled={isApplying || !allColors}
                            aria-busy={isApplying}
                        >
                            {isApplying ? "Aplicando..." : "Aplicar tema"}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 col-span-2">
                    <div
                        className="aspect-video flex flex-col justify-between p-6 rounded-md border overflow-hidden relative"
                        style={{
                            background: allColors?.background_color,
                            color: allColors?.text_primary_color,
                        }}
                    >
                        <div
                            className="flex items-center justify-between p-3 -m-6 mb-4"
                            style={{
                                background: allColors?.header_color,
                                color: allColors?.text_primary_color,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                    style={{
                                        background: allColors?.primary_color,
                                        color: getContrastText(
                                            allColors?.primary_color || "#000",
                                            theme
                                        ),
                                    }}
                                >
                                    P
                                </div>
                                <span className="font-semibold">PlayFiver</span>
                            </div>
                            <div className="flex gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        background: allColors?.accent_color,
                                    }}
                                ></div>
                                <div
                                    className="w-3 h-3 rounded-full opacity-60"
                                    style={{
                                        background: allColors?.secondary_color,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-4">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold mb-2">
                                    Testando Suas{" "}
                                    <span
                                        style={{
                                            color: allColors?.accent_color,
                                        }}
                                    >
                                        Cores
                                    </span>
                                </h1>
                                <p className="text-sm opacity-80">
                                    As cores aqui escolhidas, serão enviadas
                                    para o touros bet
                                </p>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <Button
                                    size="sm"
                                    style={{
                                        background: allColors?.color_button1,
                                        color: getContrastText(
                                            allColors?.color_button1 || "#000",
                                            theme
                                        ),
                                        border: "none",
                                    }}
                                >
                                    Começar Agora
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    style={{
                                        borderColor: allColors?.color_button2,
                                        color: allColors?.color_button2,
                                        background: "transparent",
                                    }}
                                >
                                    Saiba Mais
                                </Button>
                            </div>
                        </div>

                        <div
                            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-16 translate-x-16"
                            style={{
                                background: `linear-gradient(135deg, ${allColors?.primary_color}, ${allColors?.accent_color})`,
                            }}
                        ></div>
                        <div
                            className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-5 translate-y-12 -translate-x-12"
                            style={{ background: allColors?.secondary_color }}
                        ></div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <ColorDisplay
                            name="Texto"
                            color={allColors?.text_primary_color || "#000000"}
                            mode={theme}
                            primaryColor={color}
                            onColorChange={(newColor) => {
                                setAllColors((prev) => {
                                    const updated = prev
                                        ? {
                                              ...prev,
                                              text_primary_color: newColor,
                                          }
                                        : undefined;
                                    if (updated) {
                                        setTimeout(() => {
                                            setSelectedColors({
                                                status: customData?.status || 1,
                                                data: updated,
                                            });
                                        }, 0);
                                    }
                                    return updated;
                                });
                            }}
                        />
                        <ColorDisplay
                            name="Fundo"
                            color={allColors?.background_color || "#000000"}
                            mode={theme}
                            primaryColor={color}
                            onColorChange={(newColor) => {
                                setAllColors((prev) => {
                                    const updated = prev
                                        ? {
                                              ...prev,
                                              background_color: newColor,
                                          }
                                        : undefined;
                                    if (updated) {
                                        setTimeout(() => {
                                            setSelectedColors({
                                                status: customData?.status || 1,
                                                data: updated,
                                            });
                                        }, 0);
                                    }
                                    return updated;
                                });
                            }}
                        />
                        <ColorDisplay
                            name="Primária"
                            color={allColors?.primary_color || "#000000"}
                            mode={theme}
                            primaryColor={color}
                            onColorChange={(newColor) => {
                                setAllColors((prev) => {
                                    const updated = prev
                                        ? { ...prev, primary_color: newColor }
                                        : undefined;
                                    if (updated) {
                                        setTimeout(() => {
                                            setSelectedColors({
                                                status: customData?.status || 1,
                                                data: updated,
                                            });
                                        }, 0);
                                    }
                                    return updated;
                                });
                                setColor(newColor);
                                setInputValue(newColor.toUpperCase());
                            }}
                        />
                        <ColorDisplay
                            name="Secundária"
                            color={allColors?.secondary_color || "#000000"}
                            mode={theme}
                            primaryColor={color}
                            onColorChange={(newColor) => {
                                setAllColors((prev) => {
                                    const updated = prev
                                        ? { ...prev, secondary_color: newColor }
                                        : undefined;
                                    if (updated) {
                                        setTimeout(() => {
                                            setSelectedColors({
                                                status: customData?.status || 1,
                                                data: updated,
                                            });
                                        }, 0);
                                    }
                                    return updated;
                                });
                            }}
                        />
                        <ColorDisplay
                            name="Destaque"
                            color={allColors?.accent_color || "#000000"}
                            mode={theme}
                            primaryColor={color}
                            onColorChange={(newColor) => {
                                setAllColors((prev) => {
                                    const updated = prev
                                        ? { ...prev, accent_color: newColor }
                                        : undefined;
                                    if (updated) {
                                        setTimeout(() => {
                                            setSelectedColors({
                                                status: customData?.status || 1,
                                                data: updated,
                                            });
                                        }, 0);
                                    }
                                    return updated;
                                });
                            }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Custom;
