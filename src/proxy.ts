/**
 * Caminho: src/proxy.ts
 * Arquivo: proxy.ts
 * Descrição: Proxy do Next 16. Aplica o modo "Em construção" e redireciona usuário logado para fora das telas de login.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { MAINTENANCE_PATH, shouldShowMaintenance } from '@/lib/maintenance'

const AUTH_PATHS = ['/signin', '/signup', '/forgot-password']

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Site fechado: mostra a página de construção com 503 (não indexa)
    if (shouldShowMaintenance(pathname)) {
        return NextResponse.rewrite(new URL(MAINTENANCE_PATH, request.url), {
            status: 503,
            headers: { 'Retry-After': '86400' },
        })
    }

    // Usuário logado não volta para as telas de login
    if (AUTH_PATHS.some((path) => pathname.startsWith(path))) {
        const token = await getToken({ req: request })
        if (token) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    // Tudo, menos arquivos estáticos e internos do Next
    matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
};
