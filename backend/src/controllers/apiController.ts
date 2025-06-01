import { Request, Response } from 'express';

export const ping = (req: Request, res: Response) => {
    try {
        res.status(200).json({ pong: true });
    } catch (error) {
        console.error('Deu erro ai tio', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


