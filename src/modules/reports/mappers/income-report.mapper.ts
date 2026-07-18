import { mapPaginated } from '../../../utils/pagination';
import { PaginatedResult } from '../../../types/pagination';

import { IncomeByMemberEntity } from '../entities/income-by-member.entity';
import { IncomeByMember } from '../models/income-by-member.model';

export class IncomeReportMapper {
    static toIncomeByMember(entity: IncomeByMemberEntity): IncomeByMember {
        const model = new IncomeByMember();

        model.memberId = Number(entity.memberId);

        model.member = entity.member;

        model.count = Number(entity.count);

        model.total = Number(entity.total);

        model.average = Number(Number(entity.average).toFixed(2));

        model.firstIncome = entity.firstIncome;

        model.lastIncome = entity.lastIncome;

        return model;
    }

    static toIncomeByMemberList(result: PaginatedResult<IncomeByMemberEntity>, page = 1, size = 10) {
        const mapped = mapPaginated(result, this.toIncomeByMember);

        mapped.items = mapped.items.map((item, index) => {
            item.rank = (page - 1) * size + index + 1;

            return item;
        });

        return mapped;
    }
}
