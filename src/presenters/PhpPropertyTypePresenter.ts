import Settings from '@/dto/Settings';
import Str from '@/support/Str';
import PhpProperty from '@/dto/PhpProperty';
import ArrayType from '@/php-types/ArrayType';

export default class PhpPropertyTypePresenter {
    private readonly property: PhpProperty;
    private readonly settings: Settings;

    public constructor(property: PhpProperty, settings: Settings) {
        this.property = property;
        this.settings = settings;
    }

    public getPhpTypeNotation(): string {
        if (this.property.getTypes().length === 1) {
            if(this.property.getTypes()[0].getType() === 'array') {
                return this.property.getTypes()[0].getType();
            }
            return (this.property.isNullable() ? '?' : '') + this.property.getTypes()[0].getType();
        }

        if (this.settings.supportsUnionType()) {
            const types = this.property.getTypes().map(t => t.getType());

            if (this.property.isNullable()) {
                types.push('null');
            }

            return types.join('|');
        }

        return '';
    }

    public getPhpChildTypeNotation(): string {
        if(
            this.property.getTypes().length > 1
            || !(this.property.getTypes()[0] instanceof ArrayType)
        ) {
            return '';
        }

        const currentType: ArrayType = this.property.getTypes()[0] as ArrayType;

        if(currentType.getTypes().length !== 1) {
            return '';
        }

        return currentType.getTypes()[0].getType();
    }

    public getPhpVarName(toSingular = false): string {
        return Str.changeCase(this.property.getName(toSingular), this.settings.propertyCase);
    }

    public getPhpVar(toSingular = false): string {
        return '$' + this.getPhpVarName(toSingular);
    }

    public getPhpVarWithType(): string {
        let typeNotation = this.getPhpTypeNotation();

        if (typeNotation !== '') {
            typeNotation += ' ';
        }


        let suffix = '';
        if(this.settings.allPropertiesDefaultToNullOrArray) {
            suffix = ' = '+(this.property.getTypes()[0].getType() === 'array' ? '[]' : 'null');
        }

        return typeNotation + this.getPhpVar() + suffix;
    }

    public getPhpChildVarWithType(toSingular = false): string {
        let typeNotation = this.getPhpChildTypeNotation();

        if (typeNotation !== '') {
            typeNotation += ' ';
        }

        return typeNotation + this.getPhpVar(toSingular);
    }

    public getDocblockContent(): string {
        let isArray = false;
        if(this.property.getTypes().length === 1 && this.property.getTypes()[0].getType() === 'array') {
            isArray = true;
        }
        return this.property
            .getTypes()
            .map(p => p.getDocblockContent())
            .join('|') + (this.property.isNullable() && !isArray ? '|null' : '')
        ;
    }

    public getProperty(): PhpProperty {
        return this.property;
    }
}
