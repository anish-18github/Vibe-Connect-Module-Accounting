import { breadcrumbMap } from "../router/breadcrumbMap";

const matchRoute = (path: string, route: string): boolean => {
    const pathParts = path.split("/").filter(Boolean);
    const routeParts = route.split("/").filter(Boolean);

    if (pathParts.length !== routeParts.length) return false;

    return routeParts.every(
        (part, index) => part.startsWith(":") || part === pathParts[index]
    );
};

export function getBreadcrumbLabel(
    path: string,
    state?: any
): string {
    // Exact match first
    if (breadcrumbMap[path]) {
        const label = breadcrumbMap[path];
        return typeof label === "function" ? label(state) : label;
    }

    // Dynamic route match (SAFE)
    for (const route in breadcrumbMap) {
        if (route.includes(":") && matchRoute(path, route)) {
            const label = breadcrumbMap[route];
            return typeof label === "function" ? label(state) : label;
        }
    }

    // Fallback formatting
    return path
        .split("/")
        .pop()!
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
