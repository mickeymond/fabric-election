/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { Candidate } from './candidate';

@Object()
export class Election {

    @Property()
    public id: string;

    @Property()
    public name: string;

    @Property()
    public description: string;

    // @Property()
    // public candidates: Candidate[];

}
