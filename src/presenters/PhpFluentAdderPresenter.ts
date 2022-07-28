import PhpAdderPresenter from '@/presenters/PhpAdderPresenter';
import CodeWriter from '@/writers/CodeWriter';
import {PhpVisibility} from '@/enums/PhpVisibility';

export default class PhpFluentAdderPresenter extends PhpAdderPresenter {
    public write(codeWriter: CodeWriter): void {
        codeWriter.openMethod(PhpVisibility.Public, `${this.getMethodSignature()}: void`);
        codeWriter.writeLine(
            `$this->${this.propertyTypePresenter.getPhpVarName()}[] = ${this.propertyTypePresenter.getPhpVar()};`
        );
        codeWriter.writeLine('return $this;');
        codeWriter.closeMethod();
    }
}
