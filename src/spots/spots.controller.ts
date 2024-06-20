import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnprocessableEntityException,
  UseFilters,
} from '@nestjs/common';
import { SpotsService } from './spots.service';
import { CreateSpotRequest } from './request/create-spot.request';
import { UpdateSpotRequest } from './request/update-spot.request';
import { CustomExceptionFilter } from 'src/custom-exception/custom-exception.filter';

@UseFilters(CustomExceptionFilter)
@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() createSpotRequest: CreateSpotRequest,
  ) {
    // name: obrigatório, string, máximo 255
    if (!createSpotRequest.name || createSpotRequest.name.length > 255) {
      throw new UnprocessableEntityException(
        'Name is required and must be less than 256 characters',
      );
    }

    return this.spotsService.create({
      ...createSpotRequest,
      eventId,
    });
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':spotId')
  findOne(@Param('eventId') eventId: string, @Param('spotId') spotId: string) {
    return this.spotsService.findOne(eventId, spotId);
  }

  @Patch(':spotId')
  update(
    @Param('eventId') eventId: string,
    @Param('spotId') spotId: string,
    @Body() updateSpotRequest: UpdateSpotRequest,
  ) {
    return this.spotsService.update(eventId, spotId, updateSpotRequest);
  }

  @Delete(':spotId')
  remove(@Param('eventId') eventId: string, @Param('spotId') spotId: string) {
    return this.spotsService.remove(eventId, spotId);
  }
}
