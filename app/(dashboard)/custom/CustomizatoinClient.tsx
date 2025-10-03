"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreDefined from "./PreDefined";
import Custom from "./Custom";

const CustomizatoinClient = ({
    currentColors,
}: {
    currentColors: CustomizationResponse;
}) => {
    const [selectedColors, setSelectedColors] =
        useState<CustomizationResponse>(currentColors);

    return (
        <section>
            <Tabs defaultValue="themes" className="w-full">
                <TabsList className="w-full bg-background-primary h-10">
                    <TabsTrigger value="themes" id="pre-defined">
                        Temas Pré-Definidos
                    </TabsTrigger>
                    <TabsTrigger value="custom" id="customize">
                        Customizar
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="themes">
                    <PreDefined
                        customData={selectedColors}
                        setSelectedColors={setSelectedColors}
                    />
                </TabsContent>
                <TabsContent value="custom">
                    <Custom
                        customData={selectedColors}
                        setSelectedColors={setSelectedColors}
                    />
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default CustomizatoinClient;
