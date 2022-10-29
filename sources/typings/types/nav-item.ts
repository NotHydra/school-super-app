type pageItemChildType = {
    id: number;
    title: string;
    link: string;
    icon: string;
    confirm: boolean;
};

export type pageItemType = {
    id: number;
    title: string;
    icon: string;
    child: pageItemChildType[];
};
