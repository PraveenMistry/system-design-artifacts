interface BorrowingRulesRepository {
  getRules(): Promise<BorrowingRules>;
  updateRules(rules: BorrowingRules): Promise<void>;
}
