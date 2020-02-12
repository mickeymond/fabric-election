/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Candidate {

    @Property()
    public id: string;

    @Property()
    public name: string;

    @Property()
    public description: string;

}
