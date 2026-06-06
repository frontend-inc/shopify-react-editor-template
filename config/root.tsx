import { DefaultRootProps, RootConfig } from "@reacteditor/core";
import { createFieldGoogleFonts } from "@reacteditor/field-google-fonts";
import { ThemeProvider, ThemeProps } from "@/components/ThemeProvider";

export type RootProps = DefaultRootProps &
  ThemeProps & {
    description?: string;
    ogImage?: string;
  };

const headerFontField = createFieldGoogleFonts() as any;
const bodyFontField = createFieldGoogleFonts() as any;

export const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  defaultProps: {
    title: "Untitled",
    headerFont: "Inter",
    headerFontWeight: "600",
    bodyFont: "Inter",
    // Hex defaults so the color picker reads them and any non-picker
    // input (typed hex, AI-set value, etc.) is round-trip compatible.
    primaryColor: "#0a0a0a",
    secondaryColor: "#64748B",
    accentColor: "#f5f5f5",
    bgColor: "#ffffff",
    fgColor: "#0a0a0a",
    mutedColor: "#f5f5f5",
    radius: "md",
    shadow: "sm",
    maxWidth: "lg",
  },
  fields: {
    title: { label: "Page title", type: "text" },
    description: { label: "Description", type: "textarea" },
    ogImage: { label: "OG image", type: "image" },
    headerFont: { label: "Header font", ...headerFontField },
    headerFontWeight: {
      label: "Header font weight",
      type: "select",
      options: [
        { label: "300 — Light", value: "300" },
        { label: "400 — Regular", value: "400" },
        { label: "500 — Medium", value: "500" },
        { label: "600 — Semibold", value: "600" },
        { label: "700 — Bold", value: "700" },
        { label: "800 — Extrabold", value: "800" },
        { label: "900 — Black", value: "900" },
      ],
    },
    bodyFont: { label: "Body font", ...bodyFontField },
    primaryColor: { label: "Primary color", type: "color", placeholder: "#0a0a0a" },
    secondaryColor: { label: "Secondary color", type: "color", placeholder: "#64748B" },
    accentColor: { label: "Accent color", type: "color", placeholder: "#f5f5f5" },
    bgColor: { label: "Background color", type: "color", placeholder: "#ffffff" },
    fgColor: { label: "Foreground color", type: "color", placeholder: "#0a0a0a" },
    mutedColor: { label: "Muted color", type: "color", placeholder: "#f5f5f5" },
    radius: {
      label: "Radius",
      type: "select",
      options: [
        { label: "None (square)", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
    },
    shadow: {
      label: "Shadow",
      type: "select",
      options: [
        { label: "None", value: "none" },
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
      ],
    },
    maxWidth: {
      label: "Max width",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra large", value: "xl" },
        { label: "Full bleed", value: "full" },
      ],
    },
  },
  render: ({
    children,
    headerFont,
    headerFontWeight,
    bodyFont,
    primaryColor,
    secondaryColor,
    accentColor,
    bgColor,
    fgColor,
    mutedColor,
    radius,
    shadow,
    maxWidth,
  }) => {
    return (
      <ThemeProvider
        headerFont={headerFont}
        headerFontWeight={headerFontWeight}
        bodyFont={bodyFont}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        accentColor={accentColor}
        bgColor={bgColor}
        fgColor={fgColor}
        mutedColor={mutedColor}
        radius={radius}
        shadow={shadow}
        maxWidth={maxWidth}
      >
        {children}
      </ThemeProvider>
    );
  },
};

export default Root;
