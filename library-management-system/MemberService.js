class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async addMember(member: Member): Promise<void> {
    await this.memberRepository.add(member);
  }

  async updateMember(member: Member): Promise<void> {
    await this.memberRepository.update(member);
  }

  async deleteMember(memberId: string): Promise<void> {
    await this.memberRepository.delete(memberId);
  }

  async getMember(memberId: string): Promise<Member | null> {
    return this.memberRepository.getById(memberId);
  }

  async getAllMembers(): Promise<Member[]> {
    return this.memberRepository.getAll();
  }
}
