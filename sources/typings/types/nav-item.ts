type pageItemChildType = {
    id: number;
    title: string;
    link: string;
    icon: string;
};

export type pageItemType = {
    id: number;
    title: string;
    icon: string;
    child: pageItemChildType[];
};
