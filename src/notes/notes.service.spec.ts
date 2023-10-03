import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { Model } from 'mongoose';
import {Note} from "./models/note.schema";
import {getModelToken} from "@nestjs/mongoose";


const mockNote = {
    title: 'Test title',
    description: 'Test description',
};

const mockNoteModel = {
    save: jest.fn().mockResolvedValue(mockNote),
    find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockNote])
    }),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndRemove: jest.fn().mockReturnThis(),
    create: jest.fn().mockResolvedValue(mockNote),
    exec: jest.fn().mockResolvedValue(mockNote),
    constructor: function() {
        this.save = mockNoteModel.save;
        return this;
    }
};

describe('NotesService', () => {
    let service: NotesService;
    let model: Model<Note>;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotesService,
                {
                    provide: getModelToken(Note.name),
                    useValue: mockNoteModel,
                },
            ],
        }).compile();

        service = module.get<NotesService>(NotesService);
        model = module.get<Model<Note>>(getModelToken(Note.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of notes', async () => {
            expect(await service.findAll()).toEqual([mockNote]);
        });
    });

    describe('create', () => {
        it('should create and return a note', async () => {
            const createNoteDto = {
                title: 'Test title',
                content: 'Test description',
            };
            const result = await service.create(createNoteDto);
            expect(await service.create(createNoteDto)).toEqual(mockNote);
        });
    });

    describe('findOne', () => {
        it('should return a single note', async () => {
            const id = 'someId';
            expect(await service.findOne(id)).toEqual(mockNote);
        });
    });

    describe('update', () => {
        it('should update and return a note', async () => {
            const id = 'someId';
            const updateNoteDto = {
                title: 'Updated title',
                description: 'Updated description',
            };
            expect(await service.update(id, updateNoteDto)).toEqual(mockNote);
        });
    });

    describe('delete', () => {
        it('should delete and return a note', async () => {
            const id = 'someId';
            expect(await service.delete(id)).toEqual(mockNote);
        });
    });
});