import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type JettonMinterConfig = {
    admin: Address;
    content: Cell;
    jettonWalletCode: Cell;
};

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
    return beginCell()
        .storeCoins(0) // initial supply = 0
        .storeAddress(config.admin)
        .storeRef(config.content)
        .storeRef(config.jettonWalletCode)
        .endCell();
}

export class JettonMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonMinter(address);
    }

    static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
        const data = jettonMinterConfigToCell(config);
        const init = { code, data };
        const address = contractAddress(workchain, init);
        return new JettonMinter(address, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, opts: { value: string; queryId?: number }) {
        await provider.internal(via, {
            value: opts.value,
            init: this.init,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendMint(
        provider: ContractProvider,
        via: Sender,
        opts: {
            to: Address;
            amount: string;
            deployAmount: string;
            queryId?: number;
            value: string;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x00000001, 32) // op code for mint
                .storeUint(opts.queryId ?? 0, 64)
                .storeAddress(opts.to)
                .storeCoins(opts.amount)
                .storeCoins(opts.deployAmount)
                .endCell(),
        });
    }

    async getJettonData(provider: ContractProvider): Promise<{
        totalSupply: bigint;
        admin: Address;
        content: Cell;
    }> {
        const result = await provider.runMethod('get_jetton_data', []);
        return {
            totalSupply: result.stack.readBigNumber(),
            admin: result.stack.readAddress(),
            content: result.stack.readCell(),
        };
    }

    async getWalletAddress(provider: ContractProvider, owner: Address): Promise<Address> {
        const result = await provider.runMethod('get_wallet_address', [
            { type: 'slice', cell: beginCell().storeAddress(owner).endCell() },
        ]);
        return result.stack.readAddress();
    }
}
