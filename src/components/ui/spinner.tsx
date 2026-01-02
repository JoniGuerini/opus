import { Loader2, LucideProps } from "lucide-react";

export function Spinner({ className, ...props }: LucideProps) {
    return (
        <Loader2 className={`animate-spin ${className}`} {...props} />
    );
}
