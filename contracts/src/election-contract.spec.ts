/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { ElectionContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('ElectionContract', () => {

    let contract: ElectionContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new ElectionContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"name":"election 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"name":"election 1002 value"}'));
    });

    describe('#electionExists', () => {

        it('should return true for a election', async () => {
            await contract.electionExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a election that does not exist', async () => {
            await contract.electionExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createElection', () => {

        it('should create a election', async () => {
            await contract.createElection(ctx, '1003', 'election 1003 value', 'New Election');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"name":"election 1003 value"}'));
        });

        it('should throw an error for a election that already exists', async () => {
            await contract.createElection(ctx, '1001', 'myvalue', 'Older Election').should.be.rejectedWith(/The election 1001 already exists/);
        });

    });

    describe('#readElection', () => {

        it('should return a election', async () => {
            await contract.readElection(ctx, '1001').should.eventually.deep.equal({ name: 'election 1001 value' });
        });

        it('should throw an error for a election that does not exist', async () => {
            await contract.readElection(ctx, '1003').should.be.rejectedWith(/The election 1003 does not exist/);
        });

    });

    describe('#updateElection', () => {

        it('should update a election', async () => {
            await contract.updateElection(ctx, '1001', 'election 1001 new value', 'Changed Now');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"name":"election 1001 new value"}'));
        });

        it('should throw an error for a election that does not exist', async () => {
            await contract.updateElection(ctx, '1003', 'election 1003 new value', 'Older Now').should.be.rejectedWith(/The election 1003 does not exist/);
        });

    });

    describe('#deleteElection', () => {

        it('should delete a election', async () => {
            await contract.deleteElection(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a election that does not exist', async () => {
            await contract.deleteElection(ctx, '1003').should.be.rejectedWith(/The election 1003 does not exist/);
        });

    });

});
