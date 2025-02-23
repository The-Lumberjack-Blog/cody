
"use client"

import React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type SidebarContextType = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("Sidebar must be used within SidebarProvider")
  }
  
  return (
    <aside className={`border-r bg-background transition-all duration-300 ${
      context.collapsed ? "w-[50px]" : "w-[240px]"
    }`}>
      {children}
    </aside>
  )
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 p-4">{children}</div>
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1">{children}</div>
}

export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("SidebarGroupLabel must be used within SidebarProvider")
  }

  return context.collapsed ? null : (
    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
      {children}
    </div>
  )
}

export function SidebarGroupContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1">{children}</div>
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav className="flex flex-col gap-1">{children}</nav>
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SidebarMenuButton({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("SidebarMenuButton must be used within SidebarProvider")
  }

  const Comp = asChild ? React.Fragment : "button"
  return (
    <Comp>
      <div className={`w-full rounded-md px-2 py-1.5 text-sm hover:bg-accent cursor-pointer
        ${context.collapsed ? "justify-center" : "justify-start"}`}>
        {children}
      </div>
    </Comp>
  )
}

export function SidebarTrigger() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("SidebarTrigger must be used within SidebarProvider")
  }

  return (
    <button
      onClick={() => context.setCollapsed(!context.collapsed)}
      className="p-2 hover:bg-accent rounded-md"
    >
      {context.collapsed ? "→" : "←"}
    </button>
  )
}
