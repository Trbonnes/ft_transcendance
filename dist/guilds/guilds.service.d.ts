import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';
export declare class GuildsService {
    create(createGuildDto: CreateGuildDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateGuildDto: UpdateGuildDto): string;
    remove(id: number): string;
}
