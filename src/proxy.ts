/**
 * Caminho: src/proxy.ts
 * Arquivo: proxy.ts
 * Descrição: Proxy do Next 16. Aplica o modo "Em construção" e protege o painel admin e as telas de login.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { MAINTENANCE_PATH, shouldShowMaintenance } from '@/lib/maintenance'
import { decideAccess } from '@/lib/admin-access'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Site fechado: mostra a página de construção com 503 (não indexa)
    if (shouldShowMaintenance(pathname)) {
        return NextResponse.rewrite(new URL(MAINTENANCE_PATH, request.url), {
            status: 503,
            headers: { 'Retry-After': '86400' },
        })
    }

    // Painel e API do admin só para o dono; quem já é admin não volta ao login
    const token = await getToken({ req: request })
    const decision = decideAccess(pathname, token?.email)
    if (decision.action === 'redirect') {
        return NextResponse.redirect(new URL(decision.to, request.url))
    }
    if (decision.action === 'unauthorized') {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    return NextResponse.next()
}

export const config = {
    // Tudo, menos arquivos estáticos e internos do Next
    matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
};
