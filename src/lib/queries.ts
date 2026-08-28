import { queryOptions } from "@tanstack/react-query";

import { getPropertyFn, getSettingsFn, listPropertiesFn } from "./public.functions";

export const propertiesQuery = () =>
  queryOptions({
    queryKey: ["properties"],
    queryFn: () => listPropertiesFn(),
  });

export const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    queryFn: () => getPropertyFn({ data: { id } }),
  });

export const settingsQuery = () =>
  queryOptions({
    queryKey: ["site-settings"],
    queryFn: () => getSettingsFn(),
  });
