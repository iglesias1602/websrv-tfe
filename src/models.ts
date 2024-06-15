export interface IUser {
    id: string;
    avatarUrl: string;
    name: string;
    group: string | undefined;
}

export interface ILab {
    id: string;
    filename: string;
    isAvailable: string | undefined;
    created_at: string;
    components?: { name: string; quantity: number; imageUrl: string; }[];
}

export interface IPost {
    id: string;
    cover: string;
    title: string;
    view: number;
    comment: number;
    share: number;
    favorite: number;
    createdAt: Date;
    author: {
        name: string;
        avatarUrl: string;
    };
}

export interface IAccount {
    displayName: string;
    email: string;
    photoURL: string;
    role: string | undefined;
}

export interface IProduct {
    id: string;
    cover: string;
    name: string;
    price: number;
    priceSale: number | null;
    colors: string[];
    status: string | undefined;
}

export interface NavItemConfig {
    title: string;
    path: string;
    icon: JSX.Element;
    info?: string;
    children?;
}

export interface News {
    image;
    title;
    description;
    postedAt;
}

export interface Site {
    icon;
    value;
    name;
}

export interface HeaderLabel {
    id: string;
    label: string;
    alignRight: boolean;
}
