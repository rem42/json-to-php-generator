import Settings from '@/dto/Settings';
import Str from '@/support/Str';
import PhpPropertyTypePresenter from '@/presenters/PhpPropertyTypePresenter';
import CodeWriter from '@/writers/CodeWriter';
import {PhpVisibility} from '@/enums/PhpVisibility';

export default class PhpSetterPresenter {
    protected readonly propertyTypePresenter: PhpPropertyTypePresenter;
    protected readonly settings: Settings;

    public constructor(propertyTypePresenter: PhpPropertyTypePresenter, settings: Settings) {
        this.propertyTypePresenter = propertyTypePresenter;
        this.settings = settings;
    }

    public getMethodName(): string {
        return Str.changeCase('add_' + this.propertyTypePresenter.getPhpVarName(), this.settings.adderCase);
    }

    public write(codeWriter: CodeWriter): void {
        codeWriter.openMethod(PhpVisibility.Public, `${this.getMethodSignature()}: void`);
        codeWriter.writeLine(
            `$this->${this.propertyTypePresenter.getPhpVarName()}[] = ${this.propertyTypePresenter.getPhpVar()};`
        );
        codeWriter.closeMethod();
    }

    protected getMethodSignature(): string {
        return `${this.getMethodName()}(${this.propertyTypePresenter.getPhpChildVarWithType()})`;
    }
}
