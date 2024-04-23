import { Request, Response, NextFunction } from 'express';
import { CreateTmaMiddlewareProps, TelegramUser } from './types';
import { BinaryLike, BinaryToTextEncoding } from 'node:crypto';
import crypto from "crypto"
import { UnauthorizedError } from './UnauthorizedError';

declare global {
    namespace Express {
        interface Request {
            user?: TelegramUser;
        }
    }
}

export const TwaGuardMiddleware = (props: CreateTmaMiddlewareProps) => {
    if (!props?.telegramBotToken) {
        throw new RangeError("Telegram bot token is required")
    }
    const header = props.header ? props.header : "telegram-data"
    const failedStatusCode = props.failedStatusCode ? props.failedStatusCode : 401
    const failedStatusText = props.failedStatusText ? props.failedStatusText : "Unauthorized"
    const middleware = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authData = req?.headers[header] as string
            if (!authData) {
                throw new UnauthorizedError(failedStatusCode, failedStatusText)
            }

            const searchParams = new URLSearchParams(authData)
            const hash = searchParams.get("hash")
            searchParams.delete("hash")

            const restKeys = Array.from(searchParams.entries())
            restKeys.sort(([aKey], [bKey]) => aKey.localeCompare(bKey));

            const dataCheckString = restKeys.map(([n, v]) => `${n}=${v}`).join('\n');

            const secretKey = encodeHmac(props.telegramBotToken, "WebAppData")
            const validationKey = encodeHmac(dataCheckString, secretKey, 'hex')

            if (validationKey !== hash) {
                throw new UnauthorizedError(failedStatusCode, failedStatusText)
            }
            req.user = JSON.parse(searchParams.get('user') || '{}')
            next()
        } catch (err) {
            next(err)
        }

    }
    return middleware
}

const encodeHmac = (message: BinaryLike, key: BinaryLike, outputEncoding?: BinaryToTextEncoding): Buffer | string => {
    const hmac = crypto.createHmac('sha256', key).update(message);
    return outputEncoding ? hmac.digest(outputEncoding) : hmac.digest();
}
