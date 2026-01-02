import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    ChevronRight,
    Download,
    Loader2,
    Mail,
    Plus,
    Save,
    Trash2,
    ExternalLink,
    Heart,
    Share2,
} from "lucide-react";

export default function ComponentsPage() {
    return (
        <div className="space-y-12">
            {/* Header da página */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Componentes</h1>
                <p className="text-muted-foreground">
                    Biblioteca de componentes do Opus usando shadcn/ui
                </p>
            </div>

            {/* Seção de Buttons */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Buttons</h2>
                    <p className="text-muted-foreground">
                        Variantes de botões disponíveis no sistema de design.
                    </p>
                </div>

                {/* Variantes */}
                <div className="rounded-xl border bg-card p-6 space-y-6">
                    <h3 className="text-lg font-medium">Variantes</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button>Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button variant="destructive">Destructive</Button>
                    </div>
                </div>

                {/* Tamanhos */}
                <div className="rounded-xl border bg-card p-6 space-y-6">
                    <h3 className="text-lg font-medium">Tamanhos</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button size="sm">Small</Button>
                        <Button>Default</Button>
                        <Button size="lg">Large</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button size="icon-sm" variant="outline" aria-label="Add">
                            <Plus />
                        </Button>
                        <Button size="icon" variant="outline" aria-label="Add">
                            <Plus />
                        </Button>
                        <Button size="icon-lg" variant="outline" aria-label="Add">
                            <Plus />
                        </Button>
                    </div>
                </div>

                {/* Com ícones */}
                <div className="rounded-xl border bg-card p-6 space-y-6">
                    <h3 className="text-lg font-medium">Com Ícones</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button>
                            <Mail />
                            Enviar Email
                        </Button>
                        <Button variant="secondary">
                            <Download />
                            Download
                        </Button>
                        <Button variant="outline">
                            Próximo
                            <ArrowRight />
                        </Button>
                        <Button variant="ghost">
                            <Share2 />
                            Compartilhar
                        </Button>
                    </div>
                </div>

                {/* Estados */}
                <div className="rounded-xl border bg-card p-6 space-y-6">
                    <h3 className="text-lg font-medium">Estados</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button disabled>
                            Desabilitado
                        </Button>
                        <Button disabled>
                            <Loader2 className="animate-spin" />
                            Carregando...
                        </Button>
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="rounded-xl border bg-card p-6 space-y-6">
                    <h3 className="text-lg font-medium">Botões de Ação</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                            <Plus />
                            Novo Projeto
                        </Button>
                        <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
                            <Save />
                            Salvar
                        </Button>
                        <Button variant="destructive">
                            <Trash2 />
                            Excluir
                        </Button>
                    </div>
                </div>

                {/* Botões Arredondados */}
                <div className="rounded-xl border bg-card p-6 space-y-6">
                    <h3 className="text-lg font-medium">Arredondados (Rounded)</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button size="icon" variant="outline" className="rounded-full">
                            <Heart />
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-full">
                            <Share2 />
                        </Button>
                        <Button size="icon" className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
                            <Heart className="text-white" />
                        </Button>
                        <Button className="rounded-full">
                            Pill Button
                            <ChevronRight />
                        </Button>
                    </div>
                </div>

                {/* Grupo de Botões */}
                <div className="rounded-xl border bg-card p-6 space-y-6">
                    <h3 className="text-lg font-medium">Grupo de Botões</h3>
                    <div className="inline-flex rounded-lg border divide-x">
                        <Button variant="ghost" className="rounded-none rounded-l-lg border-0">
                            Dia
                        </Button>
                        <Button variant="ghost" className="rounded-none border-0 bg-accent">
                            Semana
                        </Button>
                        <Button variant="ghost" className="rounded-none rounded-r-lg border-0">
                            Mês
                        </Button>
                    </div>
                </div>

                {/* Como Link */}
                <div className="rounded-xl border bg-card p-6 space-y-6">
                    <h3 className="text-lg font-medium">Como Link</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="link">
                            Saiba mais
                            <ExternalLink className="size-3" />
                        </Button>
                        <Button asChild variant="outline">
                            <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
                                Documentação shadcn/ui
                                <ExternalLink className="size-3" />
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Código de Exemplo */}
            <section className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="text-lg font-medium">Exemplo de Uso</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

// Variantes disponíveis
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// Com ícone
<Button>
  <Mail />
  Enviar Email
</Button>

// Como link
<Button asChild>
  <a href="/destino">Link Button</a>
</Button>`}</code>
                </pre>
            </section>
        </div>
    );
}
