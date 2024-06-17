/* eslint-disable prettier/prettier */
export class UpdateMemberDto {
    constructor(
        public memberName: string = '',
        public memberLastName: string = '',
        public memberDescription: string = '',
        public memberRole: string = '',
        public memberImage: string = '',
        public memberLinkedin: string = ''
    ) {}
}