import PhpType from '@/php-types/PhpType';
import Settings from '@/dto/Settings';
import NullType from '@/php-types/NullType';
import ArrayType from '@/php-types/ArrayType';
import pluralize from 'pluralize';

export default class PhpProperty {
    private readonly name: string;
    private types: PhpType[] = [];
    private nullable = false;
    private settings: Settings = new Settings;

    public constructor(name: string) {
        this.name = name;
    }

    public getName(toSingular = false): string {
        return (toSingular && this.isPlural())
            ? pluralize.singular(this.name)
            : this.name
        ;
    }

    public getTypes(): PhpType[] {
        return this.types;
    }

    public add(type: PhpType): this {
        if (type instanceof NullType) {
            this.nullable = true;
            return this;
        }

        if (type instanceof ArrayType) {
            const currentArrayType = this.types.find(t => t instanceof ArrayType) as ArrayType | undefined;

            if (currentArrayType) {
                currentArrayType.merge(type);
                return this;
            }
        }

        if (this.types.some(t => t.constructor === type.constructor)) {
            return this;
        }

        this.types.push(type);

        return this;
    }

    public merge(property: PhpProperty): this {
        for (const type of property.getTypes()) {
            this.add(type);
        }

        if (property.isNullable()) {
            this.makeNullable();
        }

        return this;
    }

    public setSettings(settings: Settings): void {
        this.settings = settings;
        this.types.forEach(type => type.setSettings(settings));
    }

    public makeNullable(): void {
        this.add(new NullType);
    }

    public isNullable(): boolean {
        return this.nullable;
    }

    public isDocblockRequired(): boolean {
        if (this.types.some(type => type.isDocblockRequired())) {
            return true;
        }

        return this.types.length > 1 && !this.settings.supportsUnionType();
    }

    protected isPlural(): boolean {
        return pluralize.isPlural(this.name);
    }
}
