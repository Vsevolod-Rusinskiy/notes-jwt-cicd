import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Create note' })
  @ApiBody({ type: CreateNoteDto })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @ApiOperation({ summary: 'Get all notes' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @ApiOperation({ summary: 'Get a note by id' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a note by id' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiBody({ type: UpdateNoteDto })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @ApiOperation({ summary: 'Delete a note by id' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.notesService.delete(id);
  }
}
