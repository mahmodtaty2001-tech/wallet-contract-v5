import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type DistributionConfig = {
    admin: Address;
};

export function distributionConfigToCell(config: DistributionConfig): Cell {
    return beginCell()
        .storeAddress(config.admin)
        .storeCoins(0)
        .storeDictDirect(null)
        .storeDictDirect(null)
        .endCell();
}

export class Distribution implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Distribution(address);
    }

    static createFromConfig(config: DistributionConfig, code: Cell, workchain = 0) {
        const data = distributionConfigToCell(config);
        const init = { code, data };
        const address = contractAddress(workchain, init);
        return new Distribution(address, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, opts: { value: string; queryId?: number }) {
        await provider.internal(via, {
            value: opts.value,
            init: this.init,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendAddReward(
        provider: ContractProvider,
        via: Sender,
        opts: {
            user: Address;
            amount: string;
            queryId?: number;
            value: string;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x12345678, 32) // op code for add_reward
                .storeUint(opts.queryId ?? 0, 64)
                .storeAddress(opts.user)
                .storeCoins(opts.amount)
                .endCell(),
        });
    }

    async sendClaimReward(
        provider: ContractProvider,
        via: Sender,
        opts: {
            queryId?: number;
            value?: string;
        }
    ) {
        await provider.internal(via, {
            value: opts.value ?? '0.05',
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x87654321, 32) // op code for claim_reward
                .storeUint(opts.queryId ?? 0, 64)
                .endCell(),
        });
    }

    async sendDistributeWeekly(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: string;
            queryId?: number;
            value: string;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x11111111, 32) // op code for distribute_weekly
                .storeUint(opts.queryId ?? 0, 64)
                .storeCoins(opts.amount)
                .endCell(),
        });
    }

    async getUserReward(provider: ContractProvider, user: Address): Promise<bigint> {
        const result = await provider.runMethod('get_user_reward', [
            { type: 'slice', cell: beginCell().storeAddress(user).endCell() },
        ]);
        return result.stack.readBigNumber();
    }

    async getTotalStats(provider: ContractProvider): Promise<{ totalDistributed: bigint; totalClaimed: bigint }> {
        const result = await provider.runMethod('get_total_stats', []);
        return {
            totalDistributed: result.stack.readBigNumber(),
            totalClaimed: result.stack.readBigNumber(),
        };
    }
}
