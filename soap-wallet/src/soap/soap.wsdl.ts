export const wsdl = `
<definitions name="WalletService"
    targetNamespace="http://example.com/wallet"
    xmlns:tns="http://example.com/wallet"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns="http://schemas.xmlsoap.org/wsdl/">

    <types>
        <schema targetNamespace="http://example.com/wallet"
                xmlns="http://www.w3.org/2001/XMLSchema">
            
            <!-- Definir estructura de datos para los métodos -->
            <element name="registerClientRequest">
                <complexType>
                    <sequence>
                        <element name="document" type="string"/>
                        <element name="name" type="string"/>
                        <element name="email" type="string"/>
                        <element name="phone" type="string"/>
                    </sequence>
                </complexType>
            </element>

            <element name="rechargeWalletRequest">
                <complexType>
                    <sequence>
                        <element name="document" type="string"/>
                        <element name="phone" type="string"/>
                        <element name="amount" type="float"/>
                    </sequence>
                </complexType>
            </element>

            <element name="walletTransactionRequest">
                <complexType>
                    <sequence>
                        <element name="document" type="string"/>
                        <element name="phone" type="string"/>
                        <element name="amount" type="float"/>
                    </sequence>
                </complexType>
            </element>

            <element name="confirmPaymentRequest">
                <complexType>
                    <sequence>
                        <element name="session_id" type="string"/>
                        <element name="token" type="string"/>
                    </sequence>
                </complexType>
            </element>

            <element name="checkBalanceRequest">
                <complexType>
                    <sequence>
                        <element name="document" type="string"/>
                        <element name="phone" type="string"/>
                    </sequence>
                </complexType>
            </element>

            <element name="genericResponse">
                <complexType>
                    <sequence>
                        <element name="success" type="boolean"/>
                        <element name="cod_error" type="string"/>
                        <element name="message_error" type="string"/>
                    </sequence>
                </complexType>
            </element>
        </schema>
    </types>

    <!-- Mensajes -->
    <message name="registerClientRequest">
        <part name="parameters" element="tns:registerClientRequest"/>
    </message>

    <message name="rechargeWalletRequest">
        <part name="parameters" element="tns:rechargeWalletRequest"/>
    </message>

    <message name="walletTransactionRequest">
        <part name="parameters" element="tns:walletTransactionRequest"/>
    </message>

    <message name="confirmPaymentRequest">
        <part name="parameters" element="tns:confirmPaymentRequest"/>
    </message>

    <message name="checkBalanceRequest">
        <part name="parameters" element="tns:checkBalanceRequest"/>
    </message>

    <message name="genericResponse">
        <part name="parameters" element="tns:genericResponse"/>
    </message>

    <!-- Operaciones -->
    <portType name="WalletPort">
        <operation name="registerClient">
            <input message="tns:registerClientRequest"/>
            <output message="tns:genericResponse"/>
        </operation>
        <operation name="rechargeWallet">
            <input message="tns:rechargeWalletRequest"/>
            <output message="tns:genericResponse"/>
        </operation>
        <operation name="pay">
            <input message="tns:walletTransactionRequest"/>
            <output message="tns:genericResponse"/>
        </operation>
        <operation name="confirmPayment">
            <input message="tns:confirmPaymentRequest"/>
            <output message="tns:genericResponse"/>
        </operation>
        <operation name="checkBalance">
            <input message="tns:checkBalanceRequest"/>
            <output message="tns:genericResponse"/>
        </operation>
    </portType>

    <!-- Binding -->
    <binding name="WalletBinding" type="tns:WalletPort">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="registerClient">
            <soap:operation soapAction="http://example.com/wallet/registerClient"/>
            <input><soap:body use="literal"/></input>
            <output><soap:body use="literal"/></output>
        </operation>
        <operation name="rechargeWallet">
            <soap:operation soapAction="http://example.com/wallet/rechargeWallet"/>
            <input><soap:body use="literal"/></input>
            <output><soap:body use="literal"/></output>
        </operation>
        <operation name="pay">
            <soap:operation soapAction="http://example.com/wallet/pay"/>
            <input><soap:body use="literal"/></input>
            <output><soap:body use="literal"/></output>
        </operation>
        <operation name="confirmPayment">
            <soap:operation soapAction="http://example.com/wallet/confirmPayment"/>
            <input><soap:body use="literal"/></input>
            <output><soap:body use="literal"/></output>
        </operation>
        <operation name="checkBalance">
            <soap:operation soapAction="http://example.com/wallet/checkBalance"/>
            <input><soap:body use="literal"/></input>
            <output><soap:body use="literal"/></output>
        </operation>
    </binding>

    <!-- Servicio -->
    <service name="WalletService">
        <port name="WalletPort" binding="tns:WalletBinding">
            <soap:address location="http://localhost:4000/wallet"/>
        </port>
    </service>
</definitions>
`;