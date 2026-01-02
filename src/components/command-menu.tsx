"use client"

import * as React from "react"
import {
    Calendar,
    CreditCard,
    Home,
    Inbox,
    Layers,
    Search,
    Settings,
    User,
    Zap,
    BarChart3,
    Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { TERMINOLOGY } from "@/constants/terminology"
import { CreateSpaceDialog, CreateProjectDialog, CreateEpicDialog } from "@/components/forms"

// ... imports remain the same

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const [openSpaceDialog, setOpenSpaceDialog] = React.useState(false)
    const [openProjectDialog, setOpenProjectDialog] = React.useState(false)
    const [openEpicDialog, setOpenEpicDialog] = React.useState(false)

    // ... useEffect remains the same

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Pesquisar...</span>
                <KbdGroup className="absolute right-1.5 hidden xl:flex">
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                </KbdGroup>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Digite um comando ou pesquise..." />
                <div className="flex items-center gap-2 p-2 border-b">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold px-2 tracking-wider shrink-0 select-none">Criar:</p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-3 focus:z-10 bg-background shadow-none"
                            onClick={() => {
                                setOpen(false)
                                setOpenSpaceDialog(true)
                            }}
                        >
                            <Plus className="h-3 w-3 mr-1.5" />
                            {TERMINOLOGY.WORKSPACE}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-3 focus:z-10 bg-background shadow-none"
                            onClick={() => {
                                setOpen(false)
                                setOpenProjectDialog(true)
                            }}
                        >
                            <Plus className="h-3 w-3 mr-1.5" />
                            Projeto
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-3 focus:z-10 bg-background shadow-none"
                            onClick={() => {
                                setOpen(false)
                                setOpenEpicDialog(true)
                            }}
                        >
                            <Plus className="h-3 w-3 mr-1.5" />
                            Épico
                        </Button>
                    </div>
                </div>

                <CommandList>
                    <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                    <CommandGroup heading="Navegação">
                        <CommandItem onSelect={() => { window.location.href = "/"; setOpen(false) }}>
                            <Home />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => { window.location.href = "/projects"; setOpen(false) }}>
                            <Layers />
                            <span>Projetos</span>
                        </CommandItem>
                        <CommandItem onSelect={() => { window.location.href = "/tasks"; setOpen(false) }}>
                            <Inbox />
                            <span>Tarefas</span>
                        </CommandItem>
                        <CommandItem onSelect={() => { window.location.href = "/calendar"; setOpen(false) }}>
                            <Calendar />
                            <span>Calendário</span>
                        </CommandItem>
                        <CommandItem onSelect={() => { window.location.href = "/analytics"; setOpen(false) }}>
                            <BarChart3 />
                            <span>Analytics</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Colaboração">
                        <CommandItem onSelect={() => { window.location.href = "/team"; setOpen(false) }}>
                            <User />
                            <span>Equipe</span>
                        </CommandItem>

                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Configurações">
                        <CommandItem onSelect={() => { window.location.href = "/settings"; setOpen(false) }}>
                            <Settings />
                            <span>Configurações</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => { window.location.href = "/profile"; setOpen(false) }}>
                            <User />
                            <span>Minha Conta</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => { window.location.href = "/billing"; setOpen(false) }}>
                            <CreditCard />
                            <span>Cobrança</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

            <CreateSpaceDialog
                open={openSpaceDialog}
                onOpenChange={setOpenSpaceDialog}
                trigger={<span className="hidden" />}
            />
            <CreateProjectDialog
                open={openProjectDialog}
                onOpenChange={setOpenProjectDialog}
                trigger={<span className="hidden" />}
            />
            <CreateEpicDialog
                open={openEpicDialog}
                onOpenChange={setOpenEpicDialog}
                trigger={<span className="hidden" />}
            />
        </>
    )
}
