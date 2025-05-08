class BorrowRuleService {
  constructor(private readonly borrowingRulesRepository: BorrowingRulesRepository) {}

  async getBorrowingRules(): Promise<BorrowingRules> {
    return this.borrowingRulesRepository.getRules();
  }

  async updateBorrowingRules(rules: BorrowingRules): Promise<void> {
    await this.borrowingRulesRepository.updateRules(rules);
  }
}
