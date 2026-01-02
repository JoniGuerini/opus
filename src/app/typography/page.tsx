import {
    TypographyH1,
    TypographyH2,
    TypographyH3,
    TypographyH4,
    TypographyP,
    TypographyBlockquote,
    TypographyList,
    TypographyInlineCode,
    TypographyLead,
    TypographyLarge,
    TypographySmall,
    TypographyMuted,
} from "@/components/ui/typography"

export default function TypographyPage() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Typography</h1>
                <p className="text-muted-foreground">
                    Componentes de tipografia do shadcn/ui para textos consistentes.
                </p>
            </div>

            {/* Headers */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Headings</h2>

                <div className="space-y-8">
                    <div>
                        <TypographyMuted>h1</TypographyMuted>
                        <TypographyH1>Título Principal H1</TypographyH1>
                    </div>

                    <div>
                        <TypographyMuted>h2</TypographyMuted>
                        <TypographyH2>Título de Seção H2</TypographyH2>
                    </div>

                    <div>
                        <TypographyMuted>h3</TypographyMuted>
                        <TypographyH3>Subtítulo H3</TypographyH3>
                    </div>

                    <div>
                        <TypographyMuted>h4</TypographyMuted>
                        <TypographyH4>Heading H4</TypographyH4>
                    </div>
                </div>
            </section>

            {/* Text Styles */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Estilos de Texto</h2>

                <div className="space-y-8">
                    <div>
                        <TypographyMuted>Paragraph (p)</TypographyMuted>
                        <TypographyP>
                            Este é um parágrafo de exemplo que demonstra como o texto aparece
                            usando o componente TypographyP. Ele inclui espaçamento adequado
                            entre linhas e margens automáticas entre parágrafos consecutivos.
                        </TypographyP>
                        <TypographyP>
                            Este é o segundo parágrafo mostrando o espaçamento automático
                            entre elementos consecutivos.
                        </TypographyP>
                    </div>

                    <div>
                        <TypographyMuted>Lead</TypographyMuted>
                        <TypographyLead>
                            Um texto introdutório maior e mais suave, ideal para descrições
                            de página ou resumos.
                        </TypographyLead>
                    </div>

                    <div>
                        <TypographyMuted>Large</TypographyMuted>
                        <TypographyLarge>Texto grande e destacado</TypographyLarge>
                    </div>

                    <div>
                        <TypographyMuted>Small</TypographyMuted>
                        <TypographySmall>Texto pequeno para legendas</TypographySmall>
                    </div>

                    <div>
                        <TypographyMuted>Muted</TypographyMuted>
                        <TypographyMuted>Texto secundário com cor suave</TypographyMuted>
                    </div>
                </div>
            </section>

            {/* Blockquote */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Blockquote</h2>

                <TypographyBlockquote>
                    "A simplicidade é o último grau de sofisticação."
                    — Leonardo da Vinci
                </TypographyBlockquote>
            </section>

            {/* List */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Lista</h2>

                <TypographyList>
                    <li>Primeiro item da lista com estilo consistente</li>
                    <li>Segundo item demonstrando o espaçamento</li>
                    <li>Terceiro item com marcadores padronizados</li>
                    <li>Quarto item finalizando o exemplo</li>
                </TypographyList>
            </section>

            {/* Inline Code */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Código Inline</h2>

                <TypographyP>
                    Instale o pacote usando{" "}
                    <TypographyInlineCode>npm install @shadcn/ui</TypographyInlineCode>{" "}
                    ou importe diretamente com{" "}
                    <TypographyInlineCode>npx shadcn@latest add</TypographyInlineCode>.
                </TypographyP>
            </section>

            {/* Example Usage */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Exemplo de Uso</h2>

                <div className="rounded-lg border bg-card p-6 space-y-4">
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                        <code>{`import { TypographyH1, TypographyP } from "@/components/ui/typography"

export function MyComponent() {
  return (
    <div>
      <TypographyH1>Meu Título</TypographyH1>
      <TypographyP>Meu parágrafo de texto.</TypographyP>
    </div>
  )
}`}</code>
                    </pre>
                </div>
            </section>
        </div>
    )
}
