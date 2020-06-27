export interface IBlockProps {
    readonly hash: string;
    readonly number: number;
    readonly timestamp: number;
}
export declare class BlockHeader implements IBlockProps {
    readonly hash: string;
    readonly number: number;
    readonly timestamp: number;
    constructor(props: IBlockProps);
}
export default BlockHeader;
