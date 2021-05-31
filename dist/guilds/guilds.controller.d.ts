import { GuildsService } from './guilds.service';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';
export declare class GuildsController {
    private readonly guildsService;
    constructor(guildsService: GuildsService);
    create(createGuildDto: CreateGuildDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateGuildDto: UpdateGuildDto): string;
    remove(id: string): string;
}
