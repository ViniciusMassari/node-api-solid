export class MaxNumberOfCheckIns extends Error{
    constructor(){
        super('Max check in reached.');
    }
}