import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UnprocessableEntityException,
  UseFilters,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventRequest } from './request/create-event-request.dto';
import { UpdateEventRequest } from './request/update-event-request.dto';
import { ReserveSpotRequest } from './request/reserve-spot-request.dto';
import { CustomExceptionFilter } from 'src/custom-exception/custom-exception.filter';

const ISO_8601_FULL =
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

@UseFilters(CustomExceptionFilter)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventRequest: CreateEventRequest) {
    if (!createEventRequest.name || createEventRequest.name.length > 255) {
      throw new UnprocessableEntityException(
        'Name is required and must be less than 256 characters',
      );
    }
    if (
      !createEventRequest.description ||
      createEventRequest.description.length > 255
    ) {
      throw new UnprocessableEntityException(
        'Description is required and must be less than 256 characters',
      );
    }
    if (
      !createEventRequest.date ||
      !ISO_8601_FULL.test(createEventRequest.date)
    ) {
      throw new UnprocessableEntityException(
        'Date is required and must be in ISO8601 format',
      );
    }
    if (!createEventRequest.price || createEventRequest.price < 0) {
      throw new UnprocessableEntityException(
        'Price is required and must be greater than or equal to 0',
      );
    }
    /*
    name: obrigatório, string, máximo 255
description: obrigatório, string, máximo 255
date: obrigatório, string, formato ISO8601
price: obrigatório, numbero, mínimo 0
    */
    return this.eventsService.create(createEventRequest);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventRequest: UpdateEventRequest,
  ) {
    return this.eventsService.update(id, updateEventRequest);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  //@UseGuards(AuthGuard)
  @Post(':id/reserve')
  reserveSpots(
    @Body() reserveRequest: ReserveSpotRequest,
    @Param('id') eventId: string,
  ) {
    if (!reserveRequest.spots || !Array.isArray(reserveRequest.spots)) {
      throw new UnprocessableEntityException(
        'Spots is required and must be an array of strings',
      );
    }
    if (
      !reserveRequest.ticket_kind ||
      (reserveRequest.ticket_kind !== 'full' &&
        reserveRequest.ticket_kind !== 'half')
    ) {
      throw new UnprocessableEntityException(
        'Ticket kind is required and must be full or half',
      );
    }
    /*
    spots: obrigatório, array, string
ticket_kind: obrigatório, precisa ter os valores “full” ou “half”
    */
    return this.eventsService.reserveSpot({ ...reserveRequest, eventId });
  }
}
