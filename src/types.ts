export type TelegramUser = {
    id: string
    first_name: string
    last_name: string
    username: string
    language_code: string
}

export type CreateTmaMiddlewareProps = {
    telegramBotToken: string
    header?: string
    failedStatusCode?: number
    failedStatusText?: string
}