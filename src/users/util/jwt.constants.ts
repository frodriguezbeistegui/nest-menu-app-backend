import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export class jwtConstants {
    constructor(private configService: ConfigService){
         secret: this.configService.get<string>("JWT_SECRET")
    }

}
