import { PaginatedResult } from 'src/types/pagination';
import { IncomeReportFilterDto } from '../dto/income-report-filter.dto';
import { IncomeRankingFilterDto } from '../dto/income-report-ranking-filter.dto';
import { IncomeByMemberResponse } from '../responses/income-by-member.response';
import { IncomeByPaymentMethodResponse } from '../responses/income-by-payment-method.response';
import { IncomeByTypeResponse } from '../responses/income-by-type.response';
import { IncomeMonthlyResponse } from '../responses/income-monthly.response';
import { IncomeSummaryResponse } from '../responses/income-summary.response';
import { IncomeByMemberEntity } from '../entities/income-by-member.entity';

export abstract class ReportsRepositoryImpl {
    abstract incomeSummary(filters: any): Promise<IncomeSummaryResponse>;
    abstract incomeMonthly(filters: IncomeReportFilterDto): Promise<IncomeMonthlyResponse[]>;
    abstract incomeByType(filters: IncomeReportFilterDto): Promise<IncomeByTypeResponse[]>;
    abstract incomeByPaymentMethod(filters: IncomeReportFilterDto): Promise<IncomeByPaymentMethodResponse[]>;
    abstract incomeByMember(filters: IncomeReportFilterDto): Promise<IncomeByMemberResponse[]>;
    abstract incomeByMemberPaginated(criteria: IncomeRankingFilterDto): Promise<PaginatedResult<IncomeByMemberEntity>>;
}
