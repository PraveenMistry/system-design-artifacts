interface MemberRepository {
  add(member: Member): Promise<void>;
  update(member: Member): Promise<void>;
  delete(memberId: string): Promise<void>;
  getById(memberId: string): Promise<Member | null>;
  getAll(): Promise<Member[]>;
}
