export type navItemChildType = {
    id: number;
    title: string;
    link: string;
};

export type navItemType = {
    id: number;
    title: string;
    icon: string;
    child: navItemChildType[];
};
