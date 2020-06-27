import { IBlockProps, BlockHeader } from './BlockHeader';
export declare class Block extends BlockHeader {
    readonly txids: string[];
    constructor(props: IBlockProps, txids: string[]);
}
export default Block;
