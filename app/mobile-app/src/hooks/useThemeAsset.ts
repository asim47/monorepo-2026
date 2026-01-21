/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Assets } from "@/constants/Assets";

export function useThemeAsset(
  assetName: keyof typeof Assets.light & keyof typeof Assets.dark,
  props?: { light?: string; dark?: string }
) {
  const theme =
    // useColorScheme() ??
    "light";
  const assetFromProps = props?.[theme];

  if (assetFromProps) {
    return assetFromProps;
  } else {
    return Assets[theme][assetName];
  }
}
