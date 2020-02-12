/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Election } from './assets/election';

@Info({title: 'ElectionContract', description: 'My Smart Contract' })
export class ElectionContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async electionExists(ctx: Context, electionId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(electionId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createElection(ctx: Context, electionId: string, name: string, description: string): Promise<void> {
        const exists = await this.electionExists(ctx, electionId);
        if (exists) {
            throw new Error(`The election ${electionId} already exists`);
        }
        const election = new Election();
        election.id = electionId;
        election.name = name;
        election.description = description;
        // election.candidates = [];
        const buffer = Buffer.from(JSON.stringify(election));
        await ctx.stub.putState(electionId, buffer);
    }

    @Transaction(false)
    @Returns('Election')
    public async readElection(ctx: Context, electionId: string): Promise<Election> {
        const exists = await this.electionExists(ctx, electionId);
        if (!exists) {
            throw new Error(`The election ${electionId} does not exist`);
        }
        const buffer = await ctx.stub.getState(electionId);
        const election = JSON.parse(buffer.toString()) as Election;
        return election;
    }

    @Transaction()
    public async updateElection(ctx: Context, electionId: string, name: string, description: string): Promise<void> {
        const exists = await this.electionExists(ctx, electionId);
        if (!exists) {
            throw new Error(`The election ${electionId} does not exist`);
        }
        const oldBuffer = await ctx.stub.getState(electionId);
        const election = JSON.parse(oldBuffer.toString()) as Election;
        election.name = name;
        election.description = description;
        const buffer = Buffer.from(JSON.stringify(election));
        await ctx.stub.putState(electionId, buffer);
    }

    @Transaction()
    public async deleteElection(ctx: Context, electionId: string): Promise<void> {
        const exists = await this.electionExists(ctx, electionId);
        if (!exists) {
            throw new Error(`The election ${electionId} does not exist`);
        }
        await ctx.stub.deleteState(electionId);
    }

}
